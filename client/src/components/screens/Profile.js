import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";
import FadeLoader from "react-spinners/FadeLoader";
import BeatLoader from "react-spinners/BeatLoader";
import MyPosts from "../screens/MyPosts";

function Profile() {
  const [myPosts, setMyPosts] = useState();
  const [image, setImage] = useState("");
  // const [loading, setLoading] = useState(false);

  const { state, dispatch } = useContext(UserContext);
  console.log(state);
  useEffect(() => {
    const abortCont = new AbortController();
    fetch("/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        // setLoading(true);
        setMyPosts(data.mypost);
      });
    return () => {
      abortCont.abort();
    };
  }, []);

  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "insta-clone");
      data.append("cloud_name", "monu1");

      fetch("	https://api.cloudinary.com/v1_1/monu1/image/upload", {
        method: "post",

        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log(result);
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: result.pic })
              );
              dispatch({ type: "UPDATEPIC", payload: result.pic });
              //window.location.reload()
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [image]);

  const updatePhoto = (file) => {
    setImage(file);
  };

  return (
    <div>
      {state ? (
        <div style={{ maxWidth: "800px", margin: "auto", marginTop: "70px" }}>
          <div className="profile-container">
            <div
              className="pic-content"
              style={{
                display: "flex",
                flexDirection: "column",

                alignItems: "center",
              }}
            >
              <img
                src={state.pic}
                style={{ width: "120px", height: "120px", borderRadius: "50%" }}
              />
              {/* {!loading && <div>loading..</div>} */}
              <div className="file-field input-field">
                <div
                  className="btn   white "
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: "600",
                    color: "blue",
                    borderRadius: "15px",
                    textTransform: "none",
                    border: "1px solid #fcd70d",
                    width: "100px",
                  }}
                >
                  <span style={{ textDecoration: "none" }}>Update Pic</span>
                  <input
                    type="file"
                    onChange={(e) => updatePhoto(e.target.files[0])}
                  />
                  {/* <div className="file-path-wrapper">
                    <input
                      className="file-path validate"
                      type="text"
                      style={{
                        fontSize: "1rem",
                        borderRadius: "40px",
                        border: "none",
                      }}
                    />
                  </div> */}
                </div>
              </div>
            </div>
            <div className="profile-desc">
              <div>
                <h4>{state.name}</h4>
                <h5 style={{ fontSize: "1.4rem", fontWeight: "400" }}>
                  {state.email}
                </h5>
              </div>

              <div
                className="follower"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "250px",
                }}
              >
                <p>{myPosts ? <strong>{myPosts.length}</strong> : "0"} posts</p>
                <p>
                  <strong>{state.followers.length}</strong> followers
                </p>
                <p>
                  <strong>{state.following.length}</strong> following
                </p>
              </div>
            </div>
          </div>
          <div
            style={
              {
                // display: "flex",
                // flexDirection: "row",
                // justifyContent: "center",
                // alignItems: "center",
                // maxWidth: "900px",
                // margin: "auto",
              }
            }
            className="profile-posts"
          >
            {" "}
            <MyPosts />
          </div>
          {/* <MyPosts /> */}
          <div className="gallery">
            {/* {myPosts ? (
              myPosts.map((myPost) => (
                <img className="item" src={myPost.imageUrl} />
              ))
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",

                  margin: "250px auto",
                }}
              >
                <FadeLoader
                  color="#1a91da"
                  height={10}
                  width={2}
                  radius={1}
                  margin={2}
                />
              </div>
            )} */}
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            margin: "250px auto",
          }}
        >
          <FadeLoader
            color="#1a91da"
            height={10}
            width={2}
            radius={1}
            margin={2}
          />
        </div>
      )}
    </div>
  );
}

export default Profile;
