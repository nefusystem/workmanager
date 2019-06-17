import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import axios from 'axios';
import moment from 'moment';
import Link from 'umi/link';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './Task.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'error', 'success'];
const status = ['未完成', '未按时完成', '按时完成'];

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新建任务"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="任务名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入任务名称！' }],
        })(<Input placeholder="请输入任务名称" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="任务描述">
        {form.getFieldDecorator('detail', {
          rules: [{ required: true, message: '请输入任务描述！' }],
        })(<Input placeholder="请输入任务描述" />)}
      </FormItem>
      <FormItem   labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}  label="开始时间">
        {form.getFieldDecorator('startTime', {
          rules: [{ required: true, message: '请输入开始时间' }],
        })(<DatePicker style={{ width: '100%' }} placeholder="请输入开始时间" />)}
      </FormItem>
      <FormItem   labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}  label="截止时间">
        {form.getFieldDecorator('endTime', {
          rules: [{ required: true, message: '请输入截止时间' }],
        })(<DatePicker style={{ width: '100%' }} placeholder="请输入截止时间" />)}
      </FormItem>
    </Modal>
  );
});

@Form.create()
class UpdateForm extends PureComponent {
  static defaultProps = {
    handleUpdate: () => {},
    handleUpdateModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        name: props.values.name,
        detail: props.values.detail,
        id: props.values.id,
        startTime: props.values.startTime,
        endTime:props.values.endTime,
      },
      currentStep: 0,
      teacher:[],
      val:1
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }
  handleChange = value => {
    const { handleUpdateModalVisible,form } = this.props;
    const {  formVals } = this.state;
  
    form.validateFields((err, fieldsValue) => {
    
      const params=fieldsValue.teacher
      const arr=[]
      fieldsValue.teacher.map((item)=>{
        arr.push({"id":item})
      })
    
      const id=formVals.id
   
        axios.post( `http://192.168.43.245:8080/api/manager/addUserTask/${id}`, (arr)).then(res=>{
      
          const description=JSON.stringify(res.data.result)
       
          this.setState({
            selectedRows: [],
          });
          setTimeout(window.location.href= window.location.href,5000)
     
        })
       
        handleUpdateModalVisible();
        
    })
 
   
  
  }
  handleNext = currentStep => {
    const { form, handleUpdate } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          formVals,
        },
        () => {
        
            handleUpdate(formVals);
          
        }
      );
    });
  };

  backward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep - 1,
    });
  };

  forward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  };

  renderContent = (currentStep, formVals) => {
    const { form } = this.props;
    if (currentStep === 1) {
      return [
        <FormItem key="target" {...this.formLayout} label="监控对象">
          {form.getFieldDecorator('target', {
            initialValue: formVals.target,
          })(
            <Select style={{ width: '100%' }}>
              <Option value="0">表一</Option>
              <Option value="1">表二</Option>
            </Select>
          )}
        </FormItem>,
        <FormItem key="template" {...this.formLayout} label="规则模板">
          {form.getFieldDecorator('template', {
            initialValue: formVals.template,
          })(
            <Select style={{ width: '100%' }}>
              <Option value="0">规则模板一</Option>
              <Option value="1">规则模板二</Option>
            </Select>
          )}
        </FormItem>,
        <FormItem key="type" {...this.formLayout} label="规则类型">
          {form.getFieldDecorator('type', {
            initialValue: formVals.type,
          })(
            <RadioGroup>
              <Radio value="0">强</Radio>
              <Radio value="1">弱</Radio>
            </RadioGroup>
          )}
        </FormItem>,
      ];
    }
    if (currentStep === 2) {
      return [
        <FormItem key="time" {...this.formLayout} label="开始时间">
          {form.getFieldDecorator('time', {
            rules: [{ required: true, message: '请选择开始时间！' }],
          })(
            <DatePicker
              style={{ width: '100%' }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择开始时间"
            />
          )}
        </FormItem>,
        <FormItem key="frequency" {...this.formLayout} label="调度周期">
          {form.getFieldDecorator('frequency', {
            initialValue: formVals.frequency,
          })(
            <Select style={{ width: '100%' }}>
              <Option value="month">月</Option>
              <Option value="week">周</Option>
            </Select>
          )}
        </FormItem>,
      ];
    }
    return [
      <FormItem key="name" {...this.formLayout} label="规则名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入规则名称！' }],
          initialValue: formVals.name,
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="desc" {...this.formLayout} label="规则描述">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
          initialValue: formVals.desc,
        })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
      </FormItem>,
    ];
  };

  renderFooter = currentStep => {
    const { handleUpdateModalVisible, values } = this.props;
  
    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
        取消
      </Button>,
      <Button key="submit" type="primary" onClick={() => this.handleNext(currentStep)}>
      完成
    </Button>,
    ];
  };
  cancelRenderFooter = currentChange => {
    const { handleCancelModalVisible, values } = this.props;
  
    return [
     
      <Button key="submit" type="primary" onClick={() =>  this.handleChange(values)}>
        确定
    </Button>,
    ];
  };
  onChange(value){
    console.log(`selected ${value}`);
    this.setState({
        teacher:value
    })
    this.children()
   }
   children(){
    const children = [];
    const { currentStep, formVals } = this.state;
   
    const params=formVals.id
    axios.get("http://192.168.43.245:8080/api/manager/recommendteacher").then(res=>{
  
      res.data.ascExecuteUser.map((item)=>{
  
        children.push(<Option key={item.name} value={item.id}>{item.name}</Option>);

      })
    })
    
    return children
   }

  render() {
    const { updateModalVisible, handleUpdateModalVisible, values,cancelModalVisible,handleCancelModalVisible } = this.props;
    const { currentStep, formVals } = this.state;
    const { form } = this.props;
    console.log(formVals)
    return (
      <div>
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="修改任务"
        visible={updateModalVisible}
        footer={this.renderFooter(currentStep)}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
      >
        
        <FormItem key="name" {...this.formLayout} label="任务名称">
         {form.getFieldDecorator('name', {
         initialValue: formVals.name,
         
        })(<Input placeholder="请输入任务名称！" />)}
      </FormItem>,
      <FormItem key="detail" {...this.formLayout} label="任务描述">
        {form.getFieldDecorator('detail', {
         initialValue: formVals.detail,
         
        })(<Input placeholder="请输入任务描述！" />)}
      </FormItem>，
      <FormItem  {...this.formLayout}  label="开始时间">
        {form.getFieldDecorator('startTime', {
          rules: [{ required: true, message: '请输入开始时间' }],
          initialValue: formVals.startTime ? moment(formVals.startTime) : null,
        })(<DatePicker style={{ width: '100%' }} placeholder="请输入开始时间" />)}
      </FormItem>,
      <FormItem  {...this.formLayout}  label="截止时间">
        {form.getFieldDecorator('endTime', {
          rules: [{ required: true, message: '请输入截止时间' }],
          initialValue: formVals.endTime ? moment(formVals.endTime) : null,
        })(<DatePicker style={{ width: '100%' }} placeholder="请输入截止时间" />)}
      </FormItem>
      </Modal>
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="任务分配"
        visible={cancelModalVisible}
        footer={this.cancelRenderFooter(false)}
        onCancel={() => handleCancelModalVisible(false, values)}
        afterClose={() => handleCancelModalVisible()}
      >
         <FormItem key="teacher"  label="教师">
          {form.getFieldDecorator('teacher', {
           
          })(
            <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="请选择教师"
                onChange={this.onChange.bind(this)}
              >
                {this.children()}
              </Select>
          )}
        </FormItem>,
      
      </Modal>
      </div>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ taskrule, loading }) => ({
  taskrule,
  loading: loading.models.rule,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    cancelModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  columns = [
    {
      title: '任务名称',
      dataIndex: 'name',
    
    },
    {
      title: '任务描述',
      dataIndex: 'detail',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
  
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '截止时间',
      dataIndex: 'endTime',

      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => {
     
          return(
            <Fragment>
              <a onClick={() => this.handleUpdateModalVisible(true, record)}>修改</a>
              <Divider type="vertical" />
              <a onClick={() => this.handleCancelModalVisible(true, record)}>分配</a>
            </Fragment>
            )
       
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'taskrule/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'taskrule/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'taskrule/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'taskrule/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'taskrule/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };
  handleCancelModalVisible = (flag, record) => {
    console.log('record',record)
    this.setState({
      cancelModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleUpdateModalVisible = (flag, record) => {
      console.log('ssss')
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'taskrule/add',
      payload: {
        name: fields.name,
        detail: fields.detail,
        startTime: fields.startTime,
        endTime: fields.endTime,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
    setTimeout(window.location.href= window.location.href,5000)
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    dispatch({
      type: 'taskrule/update',
      payload: {
          name: fields.name,
          detail: fields.detail,
          id: fields.id,
          startTime:fields.startTime,
          endTime:fields.endTime
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
    setTimeout(window.location.href= window.location.href,5000)
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
        <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 24 }}>
          <Col md={6} sm={24}>
            <FormItem label="任务名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="所属教师">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">未分配</Option>
                  <Option value="1">未按时分配</Option>
                  <Option value="2">按时完成</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
           
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="调用次数">
              {getFieldDecorator('number')(<InputNumber style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="更新日期">
              {getFieldDecorator('date')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status3')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status4')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      taskrule: { data },
      loading,
    } = this.props;
    console.log("data",data)
    const { selectedRows, modalVisible, updateModalVisible, cancelModalVisible, stepFormValues } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleCancelModalVisible: this.handleCancelModalVisible,
      handleUpdate: this.handleUpdate,
      handleCancel: this.handleCancel,
    };
    return (
      <PageHeaderWrapper title="任务模块">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            cancelModalVisible={cancelModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
