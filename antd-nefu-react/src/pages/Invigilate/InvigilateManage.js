import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { stringify } from 'qs';
import axios from 'axios';
import Link from 'umi/link';
import {
  Row,
  Col,
  Card,
  notification,
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

import styles from './Invigilate.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


const people = ['一人', '两人', '三人'];
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
      title="新建监考信息"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="课程名称">
        {form.getFieldDecorator('subject', {
          rules: [{ required: true, message: '请输入课程名称！' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="地点">
        {form.getFieldDecorator('site', {
          rules: [{ required: true, message: '请输入地点！' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="所需人数">
        {form.getFieldDecorator('needNum', {
          rules: [{ required: true, message: '请选择所需人数！' }],
        })(<Select style={{ width: '100%' }}>
            <Option value="0">一人</Option>
            <Option value="1">两人</Option>
            <Option value="2">三人</Option>
          </Select>)}
         
      </FormItem>
      {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="分配教师">
        {form.getFieldDecorator('teacher', {
          rules: [{ required: true, message: '请选择分配教师！' }],
        })(<Select style={{ width: '100%' }}>
            <Option value="0">李振婷</Option>
            <Option value="1">小吉</Option>
            <Option value="2">薛瀚</Option>
          </Select>)}
         
      </FormItem> */}
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="开始时间">
        {form.getFieldDecorator('beginTime', {
          rules: [{ required: true, message: '请输入开始时间' }],

        })(<DatePicker style={{ width: '100%' }} placeholder="请输入开始时间" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="结束时间">
        {form.getFieldDecorator('endTime', {
          rules: [{ required: true, message: '请输入结束时间' }],
        })(<DatePicker style={{ width: '100%' }} placeholder="请输入结束时间" />)}
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
        subject: props.values.subject,
        site: props.values.site,
        id: props.values.id,
        beginTime: props.values.beginTime,
        endTime: props.values.endTime,
        needNum: props.values.needNum,
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
      if(this.state.teacher.length==formVals.needNum+1){
        axios.post( `http://192.168.43.245:8080/api/manager/addUserExam/${id}`, (arr)).then(res=>{
      
          const description=JSON.stringify(res.data.result)
          handleUpdateModalVisible();
          setTimeout(window.location.href=window.location.href,9000)
         
         
          notification.open({
            message: '分配完成',
            description: description,
            onClick: () => {
              console.log('Notification Clicked!');
              
            },
          });
        })
       
       
        
        }else{
          message.error("可选人数不符")
        }
    })
 
   
  
  }
  handleNext = currentStep => {
    const { form, handleUpdate } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
 
      if (err) return;
      const formVals = { 
          ...oldValue,
           ...fieldsValue,
        };
  
      this.setState(
        {
          formVals,
        },
        () => {
          if (currentStep < 2) {
            this.forward();
          } else {
            handleUpdate(formVals);
          }
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
        <FormItem key="needNum" {...this.formLayout} label="监考人数">
          {form.getFieldDecorator('needNum', {
            initialValue: formVals.needNum,
          })(
            <Select style={{ width: '100%' }}>
              <Option value="0">一人</Option>
              <Option value="1">二人</Option>
              <Option value="2">三人</Option>
            </Select>
          )}
        </FormItem>,
        // <FormItem key="teacher" {...this.formLayout} label="监考教师">
        //   {form.getFieldDecorator('teacher', {
        //     initialValue: formVals.teacher,
        //   })(
        //     <Select style={{ width: '100%' }}>
        //       <Option value="0">李振婷</Option>
        //       <Option value="1">薛瀚</Option>
        //       <Option value="2">叶亚桥</Option>
        //     </Select>
        //   )}
        // </FormItem>,
       
      ];
    }
    if (currentStep === 2) {
     
      const starttime=formVals.beginTime;
      const endtime=formVals.endTime;
      return [
        <FormItem key="beginTime" {...this.formLayout} label="开始时间">
          {form.getFieldDecorator('beginTime', {
            rules: [{ required: true, message: '请选择开始时间！' }],
            initialValue: formVals.beginTime ? moment(formVals.beginTime) : null,
          })(
            <DatePicker
              style={{ width: '100%' }}
           
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择开始时间"
            />
          )}
        </FormItem>,
        <FormItem key="endTime" {...this.formLayout} label="结束时间">
          {form.getFieldDecorator('endTime', {
             rules: [{ required: true, message: '请选择结束时间！' }],
             initialValue: formVals.endTime ? moment(formVals.endTime) : null,
          })(
            <DatePicker
              style={{ width: '100%' }}
             
          
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择结束时间"
            />
          )}
        </FormItem>,
      ];
    }
    return [
      <FormItem key="subject" {...this.formLayout} label="课程名称">
        {form.getFieldDecorator('subject', {
          rules: [{ required: true, message: '请输入课程名称！' }],
          initialValue: formVals.subject,
        })(<Input placeholder="请输入课程名称！" />)}
      </FormItem>,
      <FormItem key="site" {...this.formLayout} label="地点">
        {form.getFieldDecorator('site', {
          rules: [{ required: true, message: '请输入监考地点！' }],
          initialValue: formVals.site,
        })(<TextArea rows={4} placeholder="请输入监考地点！" />)}
      </FormItem>,
    ];
  };
  cancelRenderFooter = currentChange => {
    const { handleCancelModalVisible, values } = this.props;
 
    return [
     
      <Button key="submit" type="primary" onClick={() => this.handleChange(values)}>
        确定
    </Button>,
    ];
  };
  renderFooter = currentStep => {
    const { handleUpdateModalVisible, values } = this.props;
    if (currentStep === 1) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          上一步
        </Button>,
        <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
          取消
        </Button>,
        <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
          下一步
        </Button>,
      ];
    }
    if (currentStep === 2) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          上一步
        </Button>,
        <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={() => this.handleNext(currentStep)}>
          完成
        </Button>,
      ];
    }
    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisible(false, values)}>
        取消
      </Button>,
      <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
        下一步
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
    const { updateModalVisible,cancelModalVisible, handleUpdateModalVisible,handleCancelModalVisible, values } = this.props;
    const { currentStep, formVals } = this.state;
    const { form } = this.props;
   
  
   
    return (
      <div>
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="监考信息修改"
        visible={updateModalVisible}
        footer={this.renderFooter(currentStep)}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
      >
        <Steps style={{ marginBottom: 28 }} size="small" current={currentStep}>
          <Step title="基本信息" />
          <Step title="配置监考教师" />
          <Step title="修改监考时间" />
        </Steps>
        {this.renderContent(currentStep, formVals)}
      </Modal>
        <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="教师分配"
        visible={cancelModalVisible}
        footer={this.cancelRenderFooter(false)}
        onCancel={() => handleCancelModalVisible(false, values)}
        afterClose={() => handleCancelModalVisible()}
      >
         <FormItem key="teacher"  label="监考教师">
          {form.getFieldDecorator('teacher', {
           
          })(
            <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="请选择监考教师"
                onChange={this.onChange.bind(this)}
              >
                {this.children()}
              </Select>
          )}
        </FormItem>,
      
      </Modal></div>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    cancelModalVisible:false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    refresh:""
  };

  columns = [
    {
      title: '课程名称',
      dataIndex: 'subject',
     
    },
    {
      title: '地点',
      dataIndex: 'site',
    },
    {
      title: '所属教师',
      dataIndex: 'teacher',
    },
    {
      title: '所需人数',
      dataIndex: 'needNum',
      render(val) {
     
        if(val===0){
          const people = '一人';
            return <span>{people}</span>;
        }
        if(val===1){
          const people = '两人';
            return <span>{people}</span>;
        }
        if(val===2){
          const people = '三人';
            return  <span>{people}</span>;
        }
        
      }
     
    },
    {
      title: '状态',
      dataIndex: 'status',
      render(val) {
       
        if(val===0){
          const status="未分配";
          const statusMap = 'error';
            return <Badge status={statusMap} text={status} />;
        }
        if(val===1){
          const status="已分配";
          const statusMap = 'processing';
            return <Badge status={statusMap} text={status} />;
        }
        if(val===2){
          const status="已完成";
          const statusMap = 'default';
            return <Badge status={statusMap} text={status} />;
        }
        
      },
    },
    {
      title: '开始时间',
      dataIndex: 'beginTime',
     
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
 
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => {
        if(record.status===0){
          return(
            <Fragment>
              <a onClick={() => this.handleUpdateModalVisible(true, record)}>修改</a>
              <Divider type="vertical" />
              <a onClick={() => this.handleCancelModalVisible(true, record)}>分配教师</a>
            </Fragment>
            )
        }else{
          return(
            <Fragment>
            <a onClick={() => this.handleUpdateModalVisible(true, record)}>修改</a>
            <Divider type="vertical" />
            <span>分配教师</span>
          </Fragment>
            )
        }
      }
       
      
    },
  ];


  refresh(val){
    console.log("val",val)
    this.setState({
      refresh:val
    })
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
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
    console.log("params",params)
    dispatch({
      type: 'rule/fetch',
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
      type: 'rule/fetch',
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
          type: 'rule/remove',
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
        beginTime:fieldsValue.beginTime ? fieldsValue.beginTime.format('YYYY-MM-DD HH:mm:ss'):null,
      };

      this.setState({
        formValues: values,
      });
      console.log("values",values)
      dispatch({
        type: 'rule/search',
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
   
    this.setState({
      cancelModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };
  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/add',
      payload: {
        subject: fields.subject,
        site: fields.site,
        needNum: fields.needNum,
        beginTime: moment(fields.beginTime).format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment(fields.endTime).format('YYYY-MM-DD HH:mm:ss'),
     
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
  
    dispatch({
      type: 'rule/update',
      payload: {
        query: formValues,
        body: {
          subject: fields.subject,
          site: fields.site,
          id: fields.id,
          beginTime: moment(fields.beginTime).format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment(fields.endTime).format('YYYY-MM-DD HH:mm:ss'),
          needNum:fields.needNum,
        

        },
      },
    });
    message.success('配置成功');
    this.handleUpdateModalVisible();
   
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 6, lg: 24, xl: 24 }}>
          <Col md={6} sm={24}>
            <FormItem label="课程名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">未分配</Option>
                  <Option value="1">已分配</Option>
                  <Option value="2">已完成</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
          <FormItem label="开始日期">
              {getFieldDecorator('beginTime')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入开始日期" />
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
      rule: { data },
      loading,
    } = this.props;
   
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
      <PageHeaderWrapper title="监考模块">
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
