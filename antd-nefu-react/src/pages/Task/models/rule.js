import { queryTaskRule, removeTaskRule, addTaskRule,requireTaskRule, updateTaskRule } from '@/services/api';
import { query as queryUsers, queryCurrent } from '@/services/user';
export default {
  namespace: 'taskrule',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      console.log('response',response)
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryTaskRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('fetch',response)
      if (callback) callback();
    },
    *taskfetch({ payload }, { call, put }) {
      const response = yield call(requireTaskRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('fetch',response)
      if (callback) callback();
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addTaskRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeTaskRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(addTaskRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
  },
};
