
# dva的精简版  -- a simple dva

### 解决
- 从dispatch action到 effects到 reducer 以及services 四个步子一步解决
- 免去从dispatch action到 effects到 reducer 以及services 三个方法命名
- 免去写effect逻辑，reducer逻辑，services逻辑
- 只用维护一个model


### dva 数据流

##### dispatch一个action

```
        const {dispatch}=this.props;
        dispatch({
          type:'user/doUserLogin',
          payload:{
            type,
            ...values
          }
        });
```   

##### Model的 effects -> reducers

```
* doUserLogin({ payload }, { call, put }) {

      const response = yield call(postUserLogin, payload);
      yield put({
        type: 'saveCurrentUser',
        payload: response.data,
      });
    },
    
```

#### 总结
  1.一个action引发三个方法名：doUserLogin -> postUserLogin -> saveCurrentUser
  2.Model拆分按业务拆分还是按逻辑拆分以及命名等
  3.每发出一个action都要先后修改三个文件
  
  
### simple-dva

#### 思路(一期)
- 保留dva最根本的数据流
- 用一个model命名空间代替store；
- 原本的model（ namespace ）降维为store这个model的一个属性；
- 用一个公共方法处理全部effects
- 用一个公共方法处理全部reducers
- 使用字符串'a.b.c'作为state目标层级
- 使用字符串'a.b.c'作为effects请求结果层级

##### 发出一个reducer

```
    const {dispatch}=this.props;
    dispatch({
      type:'store/doReducer', 
      key:'user.value',
      value:'value',
      payload:{
        value:e.target.value
      }
    });
```
-  发出一个action直接改变Model中的state，新增key字段和value字段
> key : 这个reducer所要改变的统一Model--store下的state对应的层级结构
> value : payload所取值的层级结构

##### 发出一个effect

```
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
```
> key : 这个reducer所要改变的统一Model--store下的state对应的层级结构
> value : payload所取值的层级结构
> post/get : 对应异步请求接口路径
> callback : 异步请求回调（关闭弹窗之类的组件内部交互）

##### Model中是公共的异步或同步处理方法

```
effects: {
    /**
     * {
     *    key:'user.list',
     *    value:'result'
     * }
     */
    * doEffect({ key, value, get, post, payload }, { call, put }) {
      // call
      const response = yield call( (params)=>{
        if(post){
          return request(post, {
            method: 'POST',
            data: params,
          });
        }
        return request(`${get}?${stringify(params)}`);
      },payload);
      
      yield put({
        type: 'doReducer',
        key,
        value,
        payload:response.data
      });
    },
  },

  reducers: {

    /**
     * {
     *    key:'user.value',
     *    value:'value'
     * }
     */
    doReducer(state,{ key, value, payload }){

      function get(schema,path) {
          var pList = path.split('.');
          var len = pList.length;
          for(var i = 0; i < len-1; i++) {
              var elem = pList[i];
              if( !schema[elem] ) schema[elem] = {}
              schema = schema[elem];
          }

          return schema[pList[len-1]];
      }

      function set(schema, path, value) {
        var pList = path.split('.');
        var len = pList.length;
        for(var i = 0; i < len-1; i++) {
            var elem = pList[i];
            if( !schema[elem] ) schema[elem] = {}
            schema = schema[elem];
        }

        schema[pList[len-1]] = value;
    }

      set(state,key, get(payload,value));

      return {...state};
    },
  },
```

> Model中主要处理了
1. 通用异步请求
2. 取相关对象某层级值，并赋值给state的某层级值

## simple-dva主要是一种思想：降级Model，通用effect和reducer封装, 目前已经实现 todolist等简单项目，正在项目实战中完善，接受大家的意见和issues;







