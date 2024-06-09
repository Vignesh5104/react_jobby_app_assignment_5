import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn, MdWork} from 'react-icons/md'
import {Link} from 'react-router-dom'

import './index.css'

const JobItems = props => {
  const {jobItemDetails} = props
  const {
    id,
    title,
    rating,
    packagePerAnnum,
    location,
    jobDescription,
    employmentType,
    companyLogoUrl,
  } = jobItemDetails

  return (
    <Link className="job-item-card-link" to={`/jobs/${id}`}>
      <li className="job-item-card-container">
        <div className="company-logo-and-job-title-item">
          <img
            className="company-logo-image"
            src={companyLogoUrl}
            alt="company logo"
          />
          <div className="job-title-and-rating-item">
            <h1 className="job-title">{title}</h1>
            <div className="rating-item">
              <AiFillStar size="18" color="#fbbf24" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="location-and-salary-package-item">
          <div className="location-and-employment-type-item">
            <div className="location-item">
              <MdLocationOn size="20" color="white" />
              <p className="location">{location}</p>
            </div>
            <div className="employment-item">
              <MdWork size="20" color="white" />
              <p className="employment-type">{employmentType}</p>
            </div>
          </div>
          <p className="salary-package">{packagePerAnnum}</p>
        </div>
        <h1 className="description-heading">Description</h1>
        <p className="job-description">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItems
