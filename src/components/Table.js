
import React, { useState, useEffect, useRef } from 'react';
import './Table.css'; 
import { dummyData } from '../data/dummyData'; 

const Table = () => {
const [colleges, setColleges] = useState([]);
const [sortBy, setSortBy] = useState(null);
const [searchTerm, setSearchTerm] = useState('');
const [visibleRows, setVisibleRows] = useState(10);
const [sortOrder, setSortOrder] = useState('desc');

const observer = useRef(null);

useEffect(() => {
  setColleges(dummyData);
}, []);

useEffect(() => {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5,
  };

  observer.current = new IntersectionObserver(handleObserver, options);

  if (colleges.length > visibleRows) {
    observer.current.observe(document.querySelector('.table-end'));
  }

  return () => {
    if (observer.current) {
      observer.current.disconnect();
    }
  };
}, [colleges, visibleRows]);

const handleObserver = (entities) => {
  const target = entities[0];
  if (target.isIntersecting) {
    setVisibleRows((prevVisibleRows) => prevVisibleRows + 10);
  }
};

const handleSearch = (e) => {
  setSearchTerm(e.target.value);
};

const handleSort = (option) => {
  let sortOrder = 'asc';
  if (option.includes('Desc')) {
    sortOrder = 'desc';
    option = option.replace('Desc', '');
  }

  setSortBy(option);
  setSortOrder(sortOrder);
};


const sortedColleges = [...colleges].sort((a, b) => {
  if (sortBy === 'cdRank') {
    return sortOrder === 'asc' ? a.cdRank - b.cdRank : b.cdRank - a.cdRank;
  } else if (sortBy === 'userReviews') {
    const aRating = parseFloat(a.userReviews.Reviews.split('/')[0]);
    const bRating = parseFloat(b.userReviews.Reviews.split('/')[0]);
    return sortOrder === 'asc' ? aRating - bRating : bRating - aRating;
  } else if (sortBy === 'fees') {
    const aFees = parseInt(a.fees.btechCSE.replace(/\D/g, ''));
    const bFees = parseInt(b.fees.btechCSE.replace(/\D/g, ''));
    return sortOrder === 'asc' ? aFees - bFees : bFees - aFees;
  } else if (sortBy === 'ranking') {
    const aRank = parseInt(a.ranking.match(/\d+/)[0]);
    const bRank = parseInt(b.ranking.match(/\d+/)[0]);
    return sortOrder === 'asc' ? aRank - bRank : bRank - aRank;
  } else {
    return 0;
  }
});

const filteredColleges = sortedColleges.filter((college) =>
  college.name.toLowerCase().includes(searchTerm.toLowerCase())
);

return (
  <div className="table-container">
    <div className="table-header">
      <input className="search-input" type="text" placeholder="Search by college name" onChange={handleSearch} />
      <i className="fas fa-search search-icon"></i><br/>
      <div className="sort-options">
        <span>Sort By</span>
        <label>
  <input type="radio" name="sortOption" value="cdRank" onChange={() => handleSort('cdRank')} />
  CollegeDunia Rating (Asc)
</label>
<label>
  <input type="radio" name="sortOption" value="cdRankDesc" onChange={() => handleSort('cdRankDesc')} />
  CollegeDunia Rating (Desc)
</label>
<label>
  <input type="radio" name="sortOption" value="userReviews" onChange={() => handleSort('userReviews')} />
  User Reviews (Asc)
</label>
<label>
  <input type="radio" name="sortOption" value="userReviewsDesc" onChange={() => handleSort('userReviewsDesc')} />
  User Reviews (Desc)
</label>
<label>
  <input type="radio" name="sortOption" value="fees" onChange={() => handleSort('fees')} />
  Fees (Asc)
</label>
<label>
  <input type="radio" name="sortOption" value="feesDesc" onChange={() => handleSort('feesDesc')} />
 Fees (Desc)
</label>
<label>
  <input type="radio" name="sortOption" value="ranking" onChange={() => handleSort('ranking')} />
  Ranking (Asc)
</label>

      </div>
    </div>
    <br/>
    <table className="college-table">
      <thead>
        <tr>
          <th>CD Rank</th>
          <th>Colleges</th>
          <th>Course Fees</th>
          <th>Placement</th>
          <th>User Reviews</th>
          <th>Ranking</th>
        </tr>
      </thead>
      <tbody>
        {filteredColleges.slice(0, visibleRows).map((college) => (
          <tr key={college.id} className={college.featured ? 'featured-row' : ''}>
            <td>{'#'}{college.cdRank}</td>
            <td className="college-cell">
              <div className="college-details">
                <img src={college.logo} alt="College Logo" className="college-logo" />
                {college.featured && <img src="https://images.collegedunia.com/public/asset/img/featured-flag.svg" alt="Featured" className="featured-flag" />}
                <span className="college-name">{college.name}</span>
              </div>
              <div className="other-details">
                <div>
                  <span>{college.location} | </span>
                  <span>{college.accreditation}</span>
                </div>
                <div>
                  <span>{college.courses[0].name}</span>
                  <div>{college.courses[0].cutoff}</div>
                  <div className="college-links">
                    <button style={{color:"rgb(234 84 12)"}}>
                      {college.courses[0].applyNowLink} <i className="fas fa-arrow-right"></i>
                    </button>
                    <button  style={{color:"rgb(16 77 116)"}}>
                      {college.courses[0].brochureLink} <i className="fas fa-download"></i>
                    </button>
                    <button  style={{color:"rgb(59 128 78)"}}>
                      {college.courses[0].compareLink} <i className="fas fa-box-open"></i>
                    </button>
                  </div>
                </div>
              </div>
            </td>
            <td>
              <div>
                <div className='second-col'>{college.fees.btechCSE}</div>
                <div className="table-cell">BE/B.Tech</div>
                <div className="table-cell"> - 1st Year Fees</div>
                <div>
                  <button className="compare-button">
                    Compare Fees <i className="fas fa-chart-line"></i>
                  </button>
                </div>
              </div>
            </td>
            <td className="table-cell">
              <div>
                <div  className='second-col'>{college.placement.averagePackage}</div>
                <div>Average</div>
                <div  className='second-col'>{college.placement.highestPackage}</div>
                <div>Highest</div>
                <div>
                  <button className="compare-button">
                    Compare Placement <i className="fas fa-chart-line"></i>
                  </button>
                </div>
              </div>
            </td>
            <td>
              <div   className='second-col'>{college.userReviews.Reviews}</div>
              <div className="table-cell">Based on {college.userReviews.users} users</div>
            </td>
            <td  className="second-col">{college.ranking}</td>
          </tr>
        ))}
        <tr className="table-end"></tr>
      </tbody>
    </table>
  </div>
);
};

export default Table;
