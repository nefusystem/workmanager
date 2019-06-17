import { queryteacherRule, removeRule, addteacherRule, updateRule } from '@/services/api';

export default {
  namespace: 'teacherrule',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryteacherRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('fetch',response)
      if (callback) callback();
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addteacherRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRule, payload);
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
  },
};
