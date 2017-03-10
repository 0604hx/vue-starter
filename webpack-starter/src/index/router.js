const routers = {
    '/index': {
      component:resolve => require(['./views/index'], resolve)
    }
};
export default routers;
