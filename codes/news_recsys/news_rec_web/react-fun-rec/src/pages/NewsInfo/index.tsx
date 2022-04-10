import { NavBar, Toast } from 'antd-mobile';
import axios from 'axios';
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToListInfo } from '../../assets/type';
import { collectionsDecrease, collectionsIncrease, likesDecrease, likesIncrease, readChange } from '../../redux/actions';
import { useSelector } from '../../redux/types/hooks';

import './index.scss'

export default function NewsInfo(){
  const navigate = useNavigate()
  const back = () => {
    navigate(-1)
  }
  const dispatch = useDispatch()
  
  const location = useLocation()
  const { id,cate } = location.state as ToListInfo;
  
  const [news_content, setNewsContent] = useState<any>({})
  const [content, setContent] = useState('')
  const [editor, setEditor] = useState('')
  const [isLike, setIsLike] = useState(false)
  const [isCollection, setIsCollection] = useState(false)
  // let isFixed: true,

  let reg = /责任编辑/
  let user_name = useSelector(state => {
    return state.userLog.data.username
  });

  let lists = useSelector(state => state.pushRecLists)

  // 点击喜欢时发送请求
  async function ifLike() {
    let val = {
      user_name: user_name,
      news_id: id,
      action_time: Date.now(),
      action_type: `likes:${isLike}`,
    }

    let successData = await axios.post("/action", val).then(res => {
      return res
    })

    if (successData.status === 200) {
      setIsLike(!isLike)
      // 调用store中的actionChange函数控制次数的变化
      if (isLike === true) {
        dispatch(likesDecrease({ lists, id }))
      } else {
        dispatch(likesIncrease({ lists, id }))
      }
    } else {
      Toast.show({
        content: '加载数据失败',
      })
    }
  };

  // 点击收藏时发送请求
  async function ifCollection() {
    let val = {
      user_name: user_name,
      news_id: id,
      action_time: Date.now(),
      action_type: `collections::${isCollection}`,
    }

    let successData = await axios.post("/action", val).then(res => {
      return res
    })

    if (successData.status === 200) {
      setIsCollection(!isCollection)
      // 调用store中的actionChange函数控制次数的变化
      if (isCollection === true) {
        dispatch(collectionsDecrease({ lists, id }))
      } else {
        dispatch(collectionsIncrease({ lists, id }))
      }
    } else {
      Toast.show({
        content: '加载数据失败',
      })
    }
  };


  useEffect(() => {
    // 获取新闻详情
    (async function getNewsInfo () {
      let successData = await axios.get("/newsInfo?news_id=" + id + '&user_name=' + user_name).then(res => {
        return res
      })

      if (successData.status === 200) {
        setNewsContent(successData.data.data)
        setContent(successData.data.data.content.split(reg)[0])
        setEditor('责任编辑:' + successData.data.data.content.split(reg)[1])

        if (successData.data.data.likes === true) {
          setIsLike(true)
        } else {
          setIsLike(false)
        }
        if (successData.data.data.collections === true) {
          setIsCollection(true)
        } else {
          setIsCollection(false)
        }
      } else {
        Toast.show({
          content: '加载数据失败',
        })
      }
    })();

    // 发送action为read的请求
    (async function sendInfo() {
      let val = {
        user_name: user_name,
        news_id: id,
        action_time: Date.now(),
        action_type: 'read',
      }

      let successData = await axios.post("/action", val).then(res => {
        return res
      })

      if (successData.status === 200) {
        dispatch(readChange({ lists, id }))
      } else {
        Toast.show({
          content: '加载数据失败',
        })
      }
    })();
  },[])


  return (
    <>
      <NavBar back='返回' onBack={back}></NavBar>
        <div className="newsinfo-continer">
          <div className="newsTitle">
            {/* 大标题 */}
            <h1>{ news_content.title }</h1>
            {/* 子标题 */}
            <p>
              <span>发布时间：{ news_content.ctime}</span>
              <span>标签：{cate}</span>
            </p>
            <hr />
          </div>

          {/* 内容区域 */}
          <div className="content" dangerouslySetInnerHTML = {{ __html : content }}></div>
          <div className="editor" dangerouslySetInnerHTML = {{ __html : editor }}></div>

          <div id="action">
            <span>喜欢:
              <img src={require("../../assets/images/likes.png")} alt='likes' className={!isLike ? 'block-style' : 'hide-style'} onClick={ifLike} />
              <img src={require("../../assets/images/likes1.png")} alt='likes1' className={isLike?'block-style':'hide-style'} onClick={ifLike} />
            </span>
            <span>收藏:
            <img src={require("../../assets/images/collects.png")} alt='collects' className={!isCollection ? 'block-style' : 'hide-style'} onClick={ifCollection} />
            <img src={require("../../assets/images/collects1.png")} alt='collects1' className={isCollection ? 'block-style' : 'hide-style'} onClick={ifCollection} />
            </span>
          </div>

        </div>

        <div className="blank"></div>
    </>
  )
}
