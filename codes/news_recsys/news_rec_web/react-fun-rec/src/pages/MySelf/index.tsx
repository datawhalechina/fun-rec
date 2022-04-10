import BottomBar from '../../components/BottomBar'

import './index.scss'
import { useNavigate } from 'react-router-dom'
import { Toast } from 'antd-mobile'
import { useSelector } from '../../redux/types/hooks'
import { useDispatch } from 'react-redux'
import { pushHotLists, pushRecLists, userLog } from '../../redux/actions'
import { CLEAR_INFO } from '../../redux/types/constant'
import { clearCookie } from '../../assets/js/cookie'

export default function MySelf() {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const quit = () => {
    dispatch(pushRecLists([]))
    dispatch(pushHotLists([]))
    dispatch(userLog(CLEAR_INFO, []))

    clearCookie('LoginName')
    clearCookie('openId')

    Toast.show({
      icon: 'success',
      content: '退出成功',
    })
    
    let second = 1;
    // 延迟一秒执行
    const timer = setInterval(() => {
      second--;
      if (!second) {
          clearInterval(timer);
        // 手动清除 Toast
        Toast.clear();
        navigate('/signIn') 
      }
    }, 1000);
  }

  const username = useSelector(state => state.userLog.data.username)

  return (
    <div className="my-info">
      <div className="profile">
        <div className="profile-pic">
          <div className="header-color"></div>
          <img className="tx" src={require('../../assets/images/datawhale.png')} alt="头像" />
        </div>
        <div className="myself-title">
          <h1>{username}</h1>
        </div>
        <button className="follow" onClick={quit}>退出登录</button>
        <div className="description">
          <h4 className="about">DataWhale 新闻推荐开源项目</h4>
          <p className="datawhale">Datawhale是一个专注于数据科学与AI领域的开源组织，汇集了众多领域院校和知名企业的优秀学习者，
            聚合了一群有开源精神和探索精神的团队成员。Datawhale 以“for the learner，和学习者一起成长”为愿景，
            鼓励真实地展现自我、开放包容、互信互助、敢于试错和勇于担当。同时 Datawhale 用开源的理念去探
            索开源内容、开源学习和开源方案，赋能人才培养，助力人才成长，建立起人与人，人与知识，人与企业和
            人与未来的联结。</p>
          <img src={require('../../assets/images/dw.png')} alt="二维码" className="dwimg" />
        </div>

        <BottomBar></BottomBar>
      </div>
    </div>
  )
}
