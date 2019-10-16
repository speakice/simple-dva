import React from 'react';
import { connect } from 'dva';
import { Input, Button, Divider, Checkbox,Icon } from 'antd';
import styles from './IndexPage.css';



@connect(({store})=>({
  value:store.user.value,
  list:store.user.list,
  eventList:store.event.list
}))
class IndexPage extends React.Component {


  state={
    eventInput:''
  }

  /**
   * 修改
   */
  handleChange=(e)=>{
    const {dispatch}=this.props;
    dispatch({
      type:'store/doReducer', 
      key:'user.value',
      value:'value',
      payload:{
        value:e.target.value
      }
    });
  }

  /**
   * 异步——查询
   */
  handleOnClick=()=>{
    const {dispatch}=this.props;
    dispatch({
      type:'store/doEffect',
      key:'user.list',
      value:'result',
      get:'/api/notices',
      psot:'',
      payload:{
        page:1,
        pageSize:10
      }
    });
  }


  /**
   * 待办事项——添加
   */
  handleAddEvent=(e)=>{
    if(!e.target.value||e.target.value.length<1){
      return;
    }
    const {dispatch,eventList}=this.props;
    dispatch({
      type:'store/doReducer',
      key:'event.list',
      value:'value',
      get:'/api/notices',
      payload:{
        value:[
          ...eventList,
          {
            id:new Date().getTime(),
            status:false,
            title:e.target.value
          }
        ]
      }
    });
    this.setState({
      eventInput:''
    })
  }

  /**
   * 待办事项——修改
   */
  onEventChange=(event,id)=>{
    const {dispatch,eventList}=this.props;
    eventList.forEach(item => {
      if(item.id===id){
        item.status=event.target.checked
      }
    });
    dispatch({
      type:'store/doReducer',
      key:'event.list',
      value:'value',
      get:'/api/notices',
      payload:{
        value:[...eventList]
      }
    });
  }

  /**
   * 待办事项——删除
   */
  onEventDelete=(id)=>{
    const {dispatch,eventList}=this.props;
    dispatch({
      type:'store/doReducer',
      key:'event.list',
      value:'value',
      get:'/api/notices',
      payload:{
        value:eventList.filter(item=>item.id!==id)
      }
    });
  }

  render (){
    const {eventInput}=this.state;
    const { value, list=[] ,eventList}=this.props;
    return (
      <div className={styles.normal}>
        <Divider orientation="center">待办事项</Divider>
        {
          eventList.map((item)=>(
            <h5 key={item.id} >
              <Checkbox style={item.status?{color:'#e2e2e2'}:{}} checked={item.status} onChange={(e)=>this.onEventChange(e,item.id)}>{item.title}</Checkbox>
              <Icon style={{color:'#e2e2e2'}} type="close" onClick={()=>this.onEventDelete(item.id)} />
            </h5>
          ))
        }
        <Input 
          value={eventInput} 
          onChange={(e)=>{this.setState({eventInput:e.target.value})}} 
          placeholder="「 回车 」新增待办" 
          style={{width:240,marginBottom:24}} 
          onPressEnter={this.handleAddEvent}/>
        <Divider orientation="center">输入框</Divider>
        <Input  placeholder="修改model中的state值" style={{width:240,marginBottom:24}} onChange={this.handleChange}/>
        <h2>Model中的state值: </h2>
        <div style={{height:24,lineHeight:'24px',marginBottom:24}}>
          {value}
        </div>
        <Divider orientation="center">异步查询</Divider> 
        <Button type="primary" onClick={this.handleOnClick}>获取异步数据</Button>
        {
          list.map(item=><div key={item.id}>{item.id}</div>)
        }
      </div>
    );
  }
  
}

export default IndexPage;
