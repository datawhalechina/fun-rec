<script>
  const hotList = []; //进入 热门 时存储数据，在喜欢和收藏是调用
  const recList = []; //进入 推荐 时存储数据，在喜欢和收藏是调用
  const type = '';  //存是登陆还是注册，返回不同的recLists的url
  const user= {
    username:'',
    age:'',
    gender:'',
  };
  
  export default {
    hotList,
    recList,
    type,
    user,
  }
</script>