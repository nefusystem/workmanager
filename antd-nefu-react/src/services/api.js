import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`http://192.168.43.245:8080/api/exams?${stringify(params)}`);
}
export async function queryManagerRule(params) {
  return request(`http://192.168.43.245:8080/api/super/managerList`);
}
export async function queryTaskRule(params) {
  return request(`http://192.168.43.245:8080/api/tasks`);
}
export async function queryteacherRule(params) {
  return request(`http://192.168.43.245:8080/api/manager/teacherList`);
}
export async function requireTaskRule(params) {
  console.log("params",params)
  return request(`http://192.168.43.245:8080/api/utList/${params}`);
}
export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',

    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  console.log("aadd",params)
  return request('http://192.168.43.245:8080/api/manager/addexam', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}
export async function addteacherRule(params) {
  console.log("aadd",params)
  return request('http://192.168.43.245:8080/api/manager/addteacher', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function addTaskRule(params) {
  console.log("aadd",params)
  return request('http://192.168.43.245:8080/api/manager/addTask', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}



export async function updateRule(params = {}) {
  console.log("updateRule",params)
  return request(`http://192.168.43.245:8080/api/manager/modifyExam?${stringify(params.query)}`, {
    method: 'POST',
    data: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function searchRule(params = {}) {
  console.log("updateRule",params)
  return request(`http://192.168.43.245:8080/api/exams`, {
    method: 'POST',
    data: {
      ...params.body,
      method: 'search',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
   console.log('params',params)
  return request('http://192.168.43.245:8080/api/login', {
    method: 'POST',
    data: params,
  });
}

export async function fakeRegister(params) {
  console.log('params',params)
  return request('/api/register', {
    method: 'POST',
    data: params,
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}
