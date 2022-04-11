import './App.css';

import { Suspense } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Skeleton, Toast } from 'antd-mobile'

import router from './routes' 
import { getCookie } from './assets/js/cookie';


function App() {
  return (
    <Routes>
      {
        router.map((item, i) => {
          if (!item.auth) {
            return (
              <Route key={i} path={item.path} element={
                <Suspense fallback={
                  <>
                    <Skeleton.Title animated />
                    <Skeleton.Paragraph lineCount={20} animated />
                  </>
                }>
                  < item.component />
                </Suspense>
              } />
            )
          } else {
            return (
              <Route key={i} path={item.path} element={
                <Suspense fallback={
                  <>
                    <Skeleton.Title animated />
                    <Skeleton.Paragraph lineCount={20} animated />
                  </>
                }>
                  <RequireAuth>
                    <item.component />
                  </RequireAuth>
                </Suspense>
              }>
              </Route>
            )
          }
        })
      }
    </Routes>
  );
}

function RequireAuth({ children }: { children: JSX.Element }) {
  let location = useLocation()
  if (!getCookie('openId')) {

    Toast.show({
      content: '暂未登录，请先登录',
    })

    let second = 1;
    // 延迟一秒执行
    const timer = setInterval(() => {
      second--;
      if (!second) {
          clearInterval(timer);
        // 手动清除 Toast
        Toast.clear();
      }
    }, 1000);

    return <Navigate to="/signIn" state={{ from: location }} replace />;
  }

  return children;
}
export default App;

