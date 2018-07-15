import * as React from 'react';
import { Table, Row, Col, Button, Input } from 'antd';
import { CONSUMER_STATES } from '@open-bucket/daemon/dist/enums';
import ActiveConsumerForm from './ActiveConsumerForm';
import Tier from '../components/Tier';

// const CONSUMER_STATES = {};
export default class ConsumerContent extends React.Component {
  handleEditName = () => {
    const { name } = this.props.selectedConsumer;
    const { setIsEditingName } = this.props;

    this.setState({ newName: name });
    setIsEditingName(true);
  }

  handleNewNameChange = (e) => {
    const { value } = e.target;

    this.setState({ newName: value });
  }

  handleSaveName = () => {
    const { updateConsumer, selectedConsumer } = this.props;
    updateConsumer({ ...selectedConsumer, name: this.state.newName });
  }

  handleUpload = () => {
    this.fileUploader.click();
  }

  handleFileSelected = (e) => {
    const { startUpload } = this.props;
    e.stopPropagation();
    e.preventDefault();
    const file = e.target.files[0];
    startUpload({ filePath: file.path });
  }

  handleActiveButtonClick = () => {
    const { state } = this.props.selectedConsumer;
    if (state === CONSUMER_STATES.INACTIVE) {
      const { setVisibleActivateConsumerForm, getAccounts } = this.props;
      getAccounts();
      setVisibleActivateConsumerForm({ isVisibleActivationForm: true });
    } else {
      // display withdraw form
    }
  }

  saveActiveFormRef = (formRef) => {
    this.activeFormRef = formRef;
  }

  handleActiveFormSubmit = (e) => {
    e.preventDefault();
    const { form } = this.activeFormRef.props;
    form.validateFields((err, values) => {
      if (!err) {
        const { accountIndex, value } = values;
        const { id } = this.props.selectedConsumer;
        const { activeConsumer } = this.props;
        activeConsumer({ consumerId: id, accountIndex, value });
      }
    });
  }

  render() {
    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    }, {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    }];

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    };

    const {
      isEditingName,
      selectedConsumer,
      isVisibleActivationForm,
      setVisibleActivateConsumerForm,
      accounts
    } = this.props;
    if (selectedConsumer) {
      const { name, tier, Files, balance, state } = this.props.selectedConsumer;
      return (
        <Row>
          <ActiveConsumerForm
            wrappedComponentRef={this.saveActiveFormRef}
            visible={isVisibleActivationForm}
            onCancel={() =>
              setVisibleActivateConsumerForm({ isVisibleActivationForm: false })}
            onSubmit={this.handleActiveFormSubmit}
            accounts={accounts}
          />
          <input type="file" onChange={this.handleFileSelected} style={{ display: 'none' }} ref={(node) => { this.fileUploader = node; }} />
          <Row type="flex" align="middle" gutter={8} style={{ marginTop: '8px' }}>
            <Col span={20}>
              <Row type="flex" align="middle" gutter={8}>
                {isEditingName && <Col span={8}><Input defaultValue={this.state.newName} size="small" onChange={this.handleNewNameChange} /></Col>}
                {isEditingName && <Col span={1}><Button shape="circle" size="small" icon="save" onClick={this.handleSaveName} /> </Col>}
                {!isEditingName && <Col ><h1>{name}</h1></Col>}
                {!isEditingName && <Col span={1}><Button shape="circle" size="small" icon="edit" onClick={this.handleEditName} /></Col>}
              </Row>
            </Col>
            <Col span={4}>
              <Row type="flex" align="middle" justify="end">
                <Button
                  type={state === CONSUMER_STATES.ACTIVE ? 'primary' : 'danger'}
                  onClick={this.handleActiveButtonClick}
                >{state === CONSUMER_STATES.ACTIVE ? 'Withdraw' : 'Active'}
                </Button>
              </Row>
            </Col>
          </Row>
          <Row type="flex" justify="space-between" gutter={8}>
            <Col>
              <h2>Files</h2>
            </Col>
            <Col>
              <Button shape="circle" icon="delete" />
              <Button shape="circle" icon="download" style={{ marginLeft: '4px' }} />
              <Button shape="circle" icon="plus" style={{ marginLeft: '4px' }} onClick={this.handleUpload} />
            </Col>
          </Row>
          <Row>
            <Table rowSelection={rowSelection} columns={columns} dataSource={Files} />
          </Row>

          <Row>
            <h2>Payment</h2>
          </Row>
          <Row type="flex" justify="start" align="middle" gutter={2}>
            <Col span={2}>
              <h3>Balance:</h3>
            </Col>
            <Col span={8}>
              {balance || 0} ETH
            </Col>
            <Col span={1}>
              <Button shape="circle" icon="plus" size="small" />
            </Col>
          </Row>

          <Row type="flex" justify="start" gutter={2}>
            <Col span={2}>
              <h3>Tier:</h3>
            </Col>
            <Col span={8}>
              <Tier tier={tier} />
            </Col>
            <Col span={1}>
              <Button shape="circle" icon="up" size="small" />
            </Col>
          </Row>

          <Row type="flex" justify="start" align="middle" gutter={8}>
            <Col>
              <h2 style={{ marginBottom: '0' }}>Configs</h2>
            </Col>
            <Col>
              <Button shape="circle" size="small" icon="edit" />
            </Col>
          </Row>
          <Row type="flex" justify="start">
            <Col span={4}>
              <h3>Space:</h3>
            </Col>
            <Col>
              <span>C://</span>
            </Col>
          </Row>
        </Row>);
    }

    return (<span >Please select a consumer</span>);
  }
}
