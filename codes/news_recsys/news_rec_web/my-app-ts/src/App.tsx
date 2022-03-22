import './App.css';

import { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import router from './routes' 

import Count from './containers/Count' //引入的Count的容器组件
import Person from './containers/Person' //引入的Person的容器组件
import Antd from './containers/Antd'

function App() {
  return (
    <div>
				<Count/>
				<hr/>
      <Person />
      <Antd></Antd>
      <Routes>
        {
        router.map((item, i) => {
          return (
            <Route key={i} path={item.path} element={
              <Suspense fallback={
                <div>loading...</div>
              }>
                < item.component />
              </Suspense>
            } />
          )
        })
        }
      </Routes>
    </div>
  );
}

export default App;
