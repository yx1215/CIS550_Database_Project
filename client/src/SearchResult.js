import React, { useEffect, useState } from 'react';
import './view/SearchResult.css';
import Logo from './Logo';
import avatar from './image/woman.jpeg';
import anime from './image/anime.jpeg';
import FilterButton from './FilterButton';
import axios from "axios";
import ResultUnit from "./resultUnit";
import UserResultUnit from "./UserResultUnit";
import FriendResultUnit from "./FriendResultUnit";
import { Pagination } from 'antd';
import 'antd/dist/antd.min.css'


const link = 'http://localhost:8080';
let username;
let animeTitle;
let animeGenre;
let animeProducer;
let animeSynopsis;
let animeNew;
let animeScore;
let animePopularity;
let friend;
let user;
let avgScore;

async function getGame() {
    let url = `${link}/search/animations?`;
    let pool = [];
    if (animeTitle) {
        pool.push(`Title=${animeTitle}`);
    }
    if (animeGenre) {
        pool.push(`Genre=${animeGenre}`);
    }
    if (animeProducer) {
        pool.push(`Producer=${animeProducer}`);
    }
    if (animeSynopsis) {
        pool.push(`Synopsis=${animeSynopsis}`);
    }
    let stringy = pool.join("&");
    url += stringy;
    const info = await axios.get(url).catch((err) => { console.log(err); });
    console.log(info);
    return info.data.results;
}

async function getUsers() {
    let result = [];
    if (parseInt(user) === "NaN") {
        let url = `${link}/search/single_user?userId=${user}`;
        const info = await axios.get(url).catch((err) => { console.log(err); });
        if (info.data.error || info.data.results.length === 0) {
            console.log(info);
        } else {
            result = info.data.results;
        }
    }
    let url2 = `${link}/search/users?nickname=${user}`;
    const info2 = await axios.get(url2).catch((err) => { console.log(err); });
    if (info2.data.error || info2.data.results.length === 0) {
        console.log(info2);
    } else {
        result = result.concat(info2.data.results);
    }
    // result+=info2.data.results;
    return result;
}

async function getFriends() {
    let result = [];
    let url = `${link}/recommend_friends?userId=${friend}`;
    const info2 = await axios.get(url).catch((err) => { console.log(err); });
    if (info2.data.error || info2.data.results.length === 0) {
        console.log(info2);
    } else {
        result = result.concat(info2.data.results);
    }
    // result+=info2.data.results;
    return result;
}

async function getGameBasedOnTime() {
    let url = `${link}/animations/sort_aired`;
    const info = await axios.get(url).catch((err) => { console.log(err); });
    console.log(info);
    return info.data.results;
}

async function getGameBasedOnScore() {
    let url = `${link}/animations/sort_score`;
    const info = await axios.get(url).catch((err) => { console.log(err); });
    console.log(info);
    return info.data.results;
}

async function getGameBasedOnPopularity() {
    let url = `${link}/animations/sort_most_viewed`;
    const info = await axios.get(url).catch((err) => { console.log(err); });
    console.log(info);
    return info.data.results;
}

async function getGameBasedOnRecommendation() {
    let url = `${link}/recommend_friends`;
    const info = await axios.get(url).catch((err) => { console.log(err); });
    console.log(info);
    return info.data.results;
}

async function getGameBasedOnAvgScore() {
    let url = `${link}/animations/sort_most_viewed`;
    const info = await axios.get(url).catch((err) => { console.log(err); });
    console.log(info);
    return info.data.results;
}


export default function SearchResult() {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    animeTitle = params.get('Title');
    animeGenre = params.get('Genre');
    animeProducer = params.get('Producer');
    animeSynopsis = params.get('Synopsis');
    animeNew = params.get('New');
    animeScore = params.get('Score');
    animePopularity = params.get('Popularity');
    user = params.get('User');
    avgScore = params.get('AvgScore');
    friend = params.get('Friendof');

    const [game, setGame] = useState([]);
    const [users, setUsers] = useState([]);
    const [friends, setFriends] = useState([]);
    const [genre, setGenre] = useState(null);
    const [producer, setProducer] = useState(null);
    const [input, setInput] = useState("");
    const [searchUrl, setSearchUrl] = useState("");

    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pagesize, setPagesize] = useState(10);

    if (!window.sessionStorage.getItem('username')) {
        window.location.replace("/login");
    }

    useEffect(() => {
        username = window.sessionStorage.getItem("username");
        if (user != null) {
            getUsers().then((result) => {
                setUsers(result);
                setTotal(result.length);
                setInput("User=" + user + ";");
            })
        } else if (animeNew === '1') {
            getGameBasedOnTime().then((result) => {
                setGame(result);
                setTotal(result.length);
                setInput("New=1;");
            })
        } else if (animeScore === "1") {
            getGameBasedOnScore().then((result) => {
                setGame(result);
                setTotal(result.length);
                setInput("Score;");
            })
        } else if (animePopularity === "1") {
            getGameBasedOnPopularity().then((result) => {
                setGame(result);
                setTotal(result.length);
                setInput("Popularity=1;");
            })
            // } else if (recommendation === "1") {
            //     getGameBasedOnRecommendation().then((result) => {
            //         setFriends(result);
            //         setInput("Recommendation=1;");
            //     })
        } else if (avgScore === "1") {
            getGameBasedOnAvgScore().then((result) => {
                setGame(result);
                setTotal(result.length);
                setInput("avgScore=1;");
            })
        } else if (friend != null) {
            getFriends().then((result) => {
                setFriends(result);
                setTotal(result.length)
                setInput("Friendof=" + friend + ";");
            })
        } else {
            getGame().then((result) => {
                setGame(result);
                setTotal(result.length);
                if (animeTitle) {
                    setInput("Title=" + animeTitle + ";");
                    // filter.Title=animeTitle;
                }
                if (animeGenre) {
                    // filter.Genre = animeGenre;
                    setInput(prevState => prevState + "Genre=" + animeGenre + ";");
                }
                if (animeProducer) {
                    // filter.Producer = animeProducer;
                    setInput(prevState => prevState + "Producer=" + animeProducer + ";");
                }

            });
        }
    }, [])

    function handleGenre(e) {
        console.log(e.target.value);
        setGenre(e.target.value);
        // filter.Genre = e.target.value;
        setInput(input + "Genre=" + e.target.value + ";");
    }

    function handleProducer(e) {
        setProducer(e.target.value);
        console.log(e.target.value);
        // filter.Producer = e.target.value;
        setInput(input + "Producer=" + e.target.value + ";");
    }

    function findByTime(e) {
        console.log(e.target.value);
        window.location.replace(`/searchResult?New=1`);
    }

    function findByScore(e) {
        console.log(e.target.value);
        window.location.replace(`/searchResult?Score=1`);
    }

    function findByPopularity(e) {
        console.log(e.target.value);
        window.location.replace(`/searchResult?Popularity=1`);
    }

    // function findByReccomendation(e) {
    //     console.log(e.target.value);
    //     window.location.replace(`/searchResult?Recommendation=1`);
    // }
    function findByAvgScore(e) {
        console.log(e.target.value);
        window.location.replace(`/searchResult?AvgScore=1`);
    }

    function changeInput(e) {
        setInput(e.target.value);
        console.log(input);
    }

    function searchFunction() {
        let temp;
        if (input === "New=1;") {
            window.location.replace(`/searchResult?New=1`);
        } else if (input === "Score=1;") {
            window.location.replace(`/searchResult?Score=1`);
        } else if (input === "Popularity=1;") {
            window.location.replace(`/searchResult?Popularity=1`);
        } else if (input === "AvgScore=1;") {
            window.location.replace(`/searchResult?AvgScore=1`);
        }
        var varibles = input.split(";");
        for (var i = 0; i < varibles.length; i++) {
            if (varibles[i].length > 0 && varibles[i].split("=").length === 1) {
                temp = varibles[i];
                varibles[i] = "Title=" + temp;
            }
        }
        temp = varibles.join("&");
        console.log(temp);
        window.location.replace(`/searchResult?${temp}`);
    }

    function findUser() {
        setInput("User=");
    }

    function findFriends() {
        setInput("Friendof=");
    }

    return (
        <div className="backgroundForGamePage">
            <Logo />

            <div>
                <div className="searchGroup">
                    <div className="searchBarSmall">
                        <input className="inputSmall" value={input} onChange={changeInput} />
                        <button className="searchButtonSmall" onClick={searchFunction}>find your love</button>
                    </div>
                    <div className="searchFilter">
                        <div className="classifier">
                            <div className="classfilter">User Oriented:</div>
                        </div>
                        <div className="filter_button" onClick={findByPopularity}>
                            <div className="filter">Most Viewed</div>
                        </div>
                        <div className="filter_button" onClick={findByScore}>
                            <div className="filter">Highly Rated</div>
                        </div>
                        <div className="filter_button" onClick={findByTime}>
                            <div className="filter">New</div>
                        </div>
                        <div className="filter_button" onClick={findUser}>
                            <div className="filter">User</div>
                        </div>
                        <div className="filter_button">
                            <select name="genre" id="genre" onChange={handleProducer}>
                                <option value="Producer">Producer</option>
                                <option value="saab">Saab</option>
                            </select>
                        </div>
                        <div className="filter_button">
                            <form action="/">
                                <select form="genre" name="genre" id="genre" onChange={handleGenre}>
                                    <option value="Genre">Genre</option>
                                    <option value="Action">Action</option>
                                    <option value="Comedy">Comedy</option>
                                </select>
                            </form>
                        </div>
                        <div className="classifier">
                            <div className="classfilter">Community:</div>
                        </div>
                        <div className="filter_button" onClick={findFriends}>
                            <div className="filter">Friends</div>
                        </div>
                        <div className="filter_button" onClick={findByAvgScore}>
                            <div className="filter">Score upon Completion</div>
                        </div>
                    </div>
                </div>

                <div className="searchResult" >
                    {(game != null && game.slice((page - 1) * pagesize, page * pagesize).map((one) => (
                        <ResultUnit gameObj={one} />
                    )))}
                    {(users != null && users.slice((page - 1) * pagesize, page * pagesize).map((one) => (
                        <UserResultUnit userObj={one} />
                    )))}
                    {(friends != null && friends.slice((page - 1) * pagesize, page * pagesize).map((one) => (
                        <FriendResultUnit friendObj={one} />
                    )))}
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", paddingBottom: "20px" }}>
                        <Pagination
                            total={total}
                            showSizeChanger
                            showTotal={total => `Total ${total} items`}
                            onChange={(page, pagesize) => {
                                setPage(page);
                                setPagesize(pagesize);
                            }}
                        />
                    </div>
                </div>

            </div>

            <div className="username">
                {username}
            </div>
        </div>

    )
}
export { SearchResult };
