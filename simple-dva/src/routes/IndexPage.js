import React from 'react';
import { connect } from 'dva';
import { Input, Button, Divider } from 'antd';
import styles from './IndexPage.css';



@connect(({store})=>({
  value:store.user.value,
  list:store.user.list
}))
class IndexPage extends React.Component {


  state={

  }

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

  handleOnClick=()=>{
    const {dispatch}=this.props;
    dispatch({
      type:'store/doEffect',
      key:'user.list',
      value:'result',
      get:'/api/notices',
      payload:{
        page:1,
        pageSize:10
      }
    });
  }

  render (){
    const { value, list=[] }=this.props;
    return (
      <div className={styles.normal}>
        <h2>输入框</h2>
        <Input style={{width:240,marginBottom:24}} onChange={this.handleChange}/>
        <h2>Model中的state值222: </h2>
        <div style={{height:24,lineHeight:'24px',marginBottom:24}}>
          {value}
        </div>
        <Divider dashed />
        <Button type="primary" onClick={this.handleOnClick}>获取异步数据</Button>
        {
          list.map(item=><div key={item.id}>{item.id}</div>)
        }
      </div>
    );
  }

}

export default IndexPage;
