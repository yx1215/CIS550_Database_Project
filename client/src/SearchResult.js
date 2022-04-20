import React from 'react';
import './view/SearchResult.css';
import Logo from './Logo';
import avatar from './image/woman.jpeg';
import FilterButton from './FilterButton';
export default function SearchResult(){
    return(
        <div className="backgroundForGamePage">
            <Logo />
            <div className="avatar">
                <img src={avatar} />
            </div>
            <div className="searchGroup">
                <div className="searchBarSmall">
                    <input className="inputSmall"/>
                    <button className="searchButtonSmall">find your love</button>
                </div>
                <div className="searchFilter">
                    <FilterButton />
                </div>
            </div>

        </div>

    )
}
export { SearchResult };
