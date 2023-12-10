import './App.css';
import { Link, Outlet } from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import fontawesome from '@fortawesome/fontawesome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import Dropzone from 'react-dropzone'
import cookie from "cookie"
import {gpx} from "togeojson"

function App() {
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState(null);

  async function logout() {
    const res = await fetch("/registration/logout/", {
      credentials: "same-origin", // include cookies!
    });
    location.reload();
  }
  
  useEffect(() => {
      getActivities();
  }, []);
  
  async function getActivities() {
      const res = await fetch('/activities/', {
      credentials: "same-origin"
      });
      const body = await res.json()
      for (const i in body) {
        const raw_gpx = atob(body[i]['activity_file'])
        var gpx_dom = (new DOMParser()).parseFromString(raw_gpx, 'text/xml');
        body[i]['geojson'] = gpx(gpx_dom);
        delete body[i]['activity_file']
      }
      setActivities(body)
  }

  useEffect(() => {
    getUser();
  }, []);
  
  async function getUser() {
    const res = await fetch('/me/', {
      credentials: "same-origin"
    });
    const body = await res.json()
    setUser(body)
    console.log(body)
  }

  navigation = <li className="nav-item"><Link to="/runs">My Activities</Link></li>

  fontawesome.library.add(faArrowRightFromBracket)

  async function uploadActivity(activityFiles) {
    var file = activityFiles[0]
    var formData = new FormData();
    formData.append('activity_file', file)

    const res = await fetch('/new_activity/', {
      credentials: "same-origin",
      method: 'POST',
      body: formData,
      headers: {
        "X-CSRFToken": cookie.parse(document.cookie).csrftoken
      }
    })

    location.reload()
  }

  return (
    <>
    <Dropzone noClick={true} onDrop={files => user ? uploadActivity(files) : {}}>
      {({getRootProps, getInputProps}) => (
      <div className="app-container" {...getRootProps()}>
              <nav className="navbar">
                <div className="navbar-brand"><Link to="/">Road Runner</Link></div>
                <div className="navbar-nav">
                  {user && <li className="nav-item"><Link to="/runs">My Activities</Link></li>}
                  {user ? <li className="nav-item"><a onClick={logout}>Log Out&nbsp;&nbsp;<FontAwesomeIcon icon="fa-solid fa-arrow-right-from-bracket" /></a></li> : <li className="nav-item"><a href="/registration/sign_in/">Sign in</a></li>}
                </div>
              </nav>
              <div className="content-container">
                <Outlet context={{
                  activities: activities,
                  user: user
                }} />
              </div>
      </div>
      )}
    </Dropzone>
    </>
  )
}

export default App;
