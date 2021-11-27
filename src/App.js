import React from "react";
import { Tabs, Layout, Button, notification} from "antd";
import "antd/dist/antd.css";
import UIController from "./controllers/UIController";
import D3Tree from "./D3Tree";
import { UnControlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
// import "codemirror/theme/material-darker.css";
const { TabPane } = Tabs;
const {Sider, Content } = Layout;

const uiController = new UIController();

// Initialize the current panes.
var currentPanes = [
  {
    title: "New Tab 0",
    // Initialize the tree to be an empty object and the dsl to empty string.
    content: { tree: {}, dsl: "" },
    key: "0",
    closable: false,
  },
];

class App extends React.Component {
  newTabIndex = 1;
  // Initialize the currentIndex to be the first pane key.
  currentIndex = currentPanes[0].key;
  constructor(props) {
    super(props);
    this.instance = null;
    this.state = {
      activeKey: currentPanes[0].key,
      panes: currentPanes,
      treeData: { name: "" },
    };
  }

  /**
   * Open a notification with an icon.
   * @param {string} type A type of notification.
   * @param {string} title A title for a notification.
   * @param {string} desc A description for a notification.
   */
  openNotificationWithIcon = (type, title, desc) => {
    notification[type]({
      style: {
        whiteSpace: "pre",
      },
      message: title,
      description: desc,
    });
  };

  /**
   * When a component mounts on the DOM object.
   */
  componentDidMount() {
    // Set the size to width 350 and height 650.
    this.instance.setSize(350, 650);
    Window.map = this;
  }

  /**
   * On a change given an activeKey.
   * @param {number} activeKey An active key value.
   */
  onChange = (activeKey) => {
    // Save everything associated with current index to currentPanes.
    for (var i = 0; i < currentPanes.length; i++) {
      console.log("indexKey: ", currentPanes[i].key);
      console.log("currentIndex: ", this.currentIndex);
      // If indexed currentPanes key matches the current index.
      if (currentPanes[i].key === this.currentIndex) {
        // Save the tree data and dsl at the current index.
        currentPanes[i]["content"]["tree"] = this.state.treeData;
        currentPanes[i]["content"]["dsl"] = this.instance.getValue();
      }
    }
    // Active key is our target key.
    // TODO: Fix variable name.
    this.currentIndex = activeKey;
    console.log(currentPanes);
    var activeKeyIndex = 0;
    // Iterate across currentPanes.
    for (i = 0; i < currentPanes.length; i++) {
      // If currentPane key at index matches active key, update activeKeyIndex.
      if (currentPanes[i].key === activeKey) {
        activeKeyIndex = i;
      }
    }
    // Set the activeKey, and treeData.
    this.setState({
      activeKey,
      // TreeData should be updated to the current panes at the activeKeyIndex.
      treeData: currentPanes[activeKeyIndex].content.tree,
    });
    // Set the text content to be DSL of currentPanes at the activeKeyIndex.
    this.instance.setValue(currentPanes[activeKeyIndex].content.dsl)
  };

  /**
   * On an edit given a targetKey and an action.
   * @param {number} targetKey An active key value.
   * @param {number} action An active key value.
   */
  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  /**
   * Adding a new tab.
   */
  add = () => {
    const { panes } = this.state;
    // Declare the activeKey to be the incremented tab index.
    const activeKey = `${this.newTabIndex++}`;
    // Spread syntax.
    const newPanes = [...panes];
    // Add a new tab to newPanes.
    newPanes.push({
      title: "New Tab " + activeKey,
      content: "Content of new Tab",
      key: activeKey,
    });
    currentPanes.push({
      title: "New Tab" + activeKey,
      content: { tree: { name: "" }, dsl: "" },
      key: activeKey,
    });
    // Iterate across newPanes and set each pane to closable.
    // This is because if we have multiple tabs, they should all be closable.
    for (var i = 0; i < newPanes.length; i++) {
      newPanes[i].closable = true;
    }
    this.setState({
      panes: newPanes,
      activeKey,
    });
    this.onChange(activeKey);
  };

  /**
   * Removing a tab.
   * @param {number} targetKey A target key number for the pane to be removed.
   */
  remove = (targetKey) => {
    // Get the panes and activeKey from this state.
    const { panes, activeKey } = this.state;
    let newActiveKey = activeKey;
    let lastIndex;
    // Iterate across each pane and index.
    panes.forEach((pane, i) => {
      // If the pane's key matches the target key, it is the pane to remove.
      if (pane.key === targetKey) {
        // Decrement the last index to move to the previous tab.
        lastIndex = i - 1;
      }
    });
    // Create a newPanes collection that includes all but the removed pane.
    const newPanes = panes.filter((pane) => pane.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
        // If we deleted the first tab.
      } else {
        // Set the newActiveKey to be the new first tab.
        newActiveKey = newPanes[0].key;
      }
    }
    this.onChange(newActiveKey);

    console.log("target", targetKey);
    // Remove the target pane from the current panes.
    currentPanes = currentPanes.filter((pane) => pane.key !== targetKey);
    console.log("newActiveKey", newActiveKey);
    console.log(currentPanes);
    this.setState({
      // Set the panes to be the newPanes.
      panes: newPanes,
      // Set the activeKey to be the newActive
      activeKey: newActiveKey,
    });
    // If only one pain remaining, set closable to false.
    if (currentPanes.length === 1) {
      newPanes[0].closable = false;
    }
  };

  setTreeData(sentData) {
    this.setState({ treeData: JSON.parse(sentData) });
  }

  getTextAreaValue() {
    return this.instance.getValue();
  }

  render() {
    const { panes, activeKey } = this.state;
    if (this.instance != null) {
      
    }
    return (
      <div>
        <Tabs
          type="editable-card"
          onChange={this.onChange}
          activeKey={activeKey}
          onEdit={this.onEdit}
        >
          {panes.map((pane) => (
            <TabPane
              tab={pane.title}
              key={pane.key}
              closable={pane.closable}
            ></TabPane>
          ))}
        </Tabs>
        <Layout>
          <Sider width={350}>
            <CodeMirror
              editorDidMount={(editor) => {
                this.instance = editor;
              }}
              options={{
                mode: null,
                lineNumbers: true,
                indentWithTabs: true,
                viewportMargin: 20,
                indentUnit: 4
              }}
            />
            <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
            <Button onClick={uiController.getInputtedDSL}>Generate</Button>
            </div>
          </Sider>
          <Content id="tree">
            <D3Tree data={this.state.treeData} />
          </Content>
        </Layout>
      </div>
    );
  }
}

export default App;
