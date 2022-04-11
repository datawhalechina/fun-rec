import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { InfiniteScroll, List } from 'antd-mobile'

import { useSelector } from '../../redux/types/hooks' 
import { useDispatch } from 'react-redux'
import axios from 'axios'

import BottomBar from '../../components/BottomBar'

import '../../assets/css/topBar.scss'

//引入action
import { pushRecLists } from '../../redux/actions'
import { Lists } from '../../assets/type'

export default function RecLists(){

  const navigate = useNavigate()
  const dispatch = useDispatch();

  const formData = useSelector(state => state.pushRecLists)
  
  const [hasMore, setHasMore] = useState(true)
  
  async function loadMore() {
    let url = '/recList'

    let successData = await axios.get(url).then((res) => {
      return res.data
    })

    dispatch(pushRecLists([...formData, ...successData.data]))
    
    setHasMore(formData.length < 40)
  }
  
  return (
    <>
      <div className="tabs">
        <input type="radio" id="tab1" name="tab-control" />
        <input type="radio" id="tab2" name="tab-control" />
        <ul>
          <li title="Features" style={{borderBottom: '2px solid #428bff'}}>
            <label htmlFor="tab1" role="button" style={{cursor: 'default',color: '#428bff'}}>
              <svg viewBox="0 0 24 24" style={{fill: '#428bff'}}>
                <path d="M14,2A8,8 0 0,0 6,10A8,8 0 0,0 14,18A8,8 0 0,0 22,10H20C20,13.32 17.32,16 14,16A6,6 0 0,1 8,10A6,6 0 0,1 14,4C14.43,4 14.86,4.05 15.27,4.14L16.88,2.54C15.96,2.18 15,2 14,2M20.59,3.58L14,10.17L11.62,7.79L10.21,9.21L14,13L22,5M4.93,5.82C3.08,7.34 2,9.61 2,12A8,8 0 0,0 10,20C10.64,20 11.27,19.92 11.88,19.77C10.12,19.38 8.5,18.5 7.17,17.29C5.22,16.25 4,14.21 4,12C4,11.7 4.03,11.41 4.07,11.11C4.03,10.74 4,10.37 4,10C4,8.56 4.32,7.13 4.93,5.82Z" />
              </svg>
              <span>推荐</span>
            </label>
          </li>
          <li title="Delivery Contents" style={{borderBottom: '2px solid #bec5cf'}} onClick={() => { navigate('/hotLists') }}>
            <label htmlFor="tab2" role="button" style={{cursor: 'default',color: '#bec5cf'}}>
              <svg viewBox="0 0 24 24" style={{fill: '#bec5cf'}}>
                <path d="M2,10.96C1.5,10.68 1.35,10.07 1.63,9.59L3.13,7C3.24,6.8 3.41,6.66 3.6,6.58L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.66,6.72 20.82,6.88 20.91,7.08L22.36,9.6C22.64,10.08 22.47,10.69 22,10.96L21,11.54V16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V10.96C2.7,11.13 2.32,11.14 2,10.96M12,4.15V4.15L12,10.85V10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V12.69L14,15.59C13.67,15.77 13.3,15.76 13,15.6V19.29L19,15.91M13.85,13.36L20.13,9.73L19.55,8.72L13.27,12.35L13.85,13.36Z" />
              </svg>
              <span>热门</span>
            </label>
          </li>
        </ul>
      </div>

      <List>
        {formData.map((item: Lists, index: number) => (
          <Link
            style={{ textDecoration:'none'}}
            key={index}
            to={`/newsInfo/${item.news_id}`}
            state={{
              id: item.news_id,
              likes: item.likes,
              collections: item.collections,
              cate: item.cate,
              read_num:item.read_num,
            }}>
            <List.Item key={index}>
              <p>
                <span className="cate">{item.cate}</span>
                <span className='title'>{ item.title }</span>
              </p>

              <p className="discribe">
                <span className="ctime">{ item.ctime} </span>
                <span className="read_num">阅读：{item.read_num}</span>
                <span className="likes">喜欢:{item.likes}</span>
                <span className="collections">收藏:{item.collections}</span>
              </p>
            </List.Item>
         </Link>
        ))}
      </List>
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
      
      <BottomBar />
    </>
    
  )
}
