import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn, MdWork} from 'react-icons/md'
import {Link} from 'react-router-dom'

import './index.css'

const SimilarJobItems = props => {
  const {similarJobsDetails, getSimilarJob} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
    id,
  } = similarJobsDetails

  const onClickSimilarJob = () => {
    getSimilarJob(id)
  }

  return (
    <Link
      className="similar-job-item-card-main-container"
      onClick={onClickSimilarJob}
      to={`/jobs/${id}`}
    >
      <li className="similar-job-item-card-container">
        <div className="similar-job-item-card-container">
          <div className="similar-job-company-logo-and-job-title-item">
            <img
              className="similar-job-company-logo-image"
              src={companyLogoUrl}
              alt="similar job company logo"
            />
            <div className="similar-job-title-and-rating-item">
              <h1 className="similar-job-title">{title}</h1>
              <div className="similar-job-rating-item">
                <AiFillStar size="18" color="#fbbf24" />
                <p className="similar-job-rating">{rating}</p>
              </div>
            </div>
          </div>
          <h1 className="similar-job-description-heading">Description</h1>
          <p className="similar-job-description">{jobDescription}</p>
          <div className="similar-job-location-and-salary-package-item">
            <div className="similar-job-location-and-employment-type-item">
              <div className="similar-job-location-item">
                <MdLocationOn size="20" color="white" />
                <p className="similar-job-location">{location}</p>
              </div>
              <div className="similar-job-employment-item">
                <MdWork size="20" color="white" />
                <p className="similar-job-employment-type">{employmentType}</p>
              </div>
            </div>
          </div>
        </div>
      </li>
    </Link>
  )
}

export default SimilarJobItems
