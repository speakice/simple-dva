import request from '../utils/request';
import { stringify } from 'qs'

export default {

  namespace: 'store',

  state: {
    user:{
      value:'',
      list:[]
    }
  },


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

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line

    },
  },
};
