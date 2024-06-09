import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn, MdWork} from 'react-icons/md'
import {BiLinkExternal} from 'react-icons/bi'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import './index.css'
import Skills from '../Skills'
import SimilarJobItems from '../SimilarJobItems'
import Header from '../Header'

const jobDetailsApiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: '',
    similarJobsList: '',
    skillsList: '',
    companyDetail: '',
    jobDetailsApiStatus: jobDetailsApiStatusConstant.initial,
  }

  componentDidMount() {
    this.fetchJobItemDetails()
  }

  fetchJobItemDetails = async similarId => {
    this.setState({jobDetailsApiStatus: jobDetailsApiStatusConstant.loading})

    const {match} = this.props
    const {params} = match
    const {id} = params

    let getId = id
    if (similarId === undefined) {
      getId = id
    } else {
      getId = similarId
    }

    const jobDetailsApi = `https://apis.ccbp.in/jobs/${getId}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(jobDetailsApi, options)

    if (response.ok === true) {
      const jobDetailsData = await response.json()

      const updateJobDetails = {
        companyLogoUrl: jobDetailsData.job_details.company_logo_url,
        companyWebsiteUrl: jobDetailsData.job_details.company_website_url,
        employmentType: jobDetailsData.job_details.employment_type,
        id: jobDetailsData.job_details.id,
        jobDescription: jobDetailsData.job_details.job_description,
        skills: jobDetailsData.job_details.skills,
        lifeAtCompany: jobDetailsData.job_details.life_at_company,
        location: jobDetailsData.job_details.location,
        packagePerAnnum: jobDetailsData.job_details.package_per_annum,
        rating: jobDetailsData.job_details.rating,
        title: jobDetailsData.job_details.title,
      }

      const updateSimilarJobsList = jobDetailsData.similar_jobs.map(
        eachSimilarJob => ({
          companyLogoUrl: eachSimilarJob.company_logo_url,
          employmentType: eachSimilarJob.employment_type,
          id: eachSimilarJob.id,
          jobDescription: eachSimilarJob.job_description,
          location: eachSimilarJob.location,
          rating: eachSimilarJob.rating,
          title: eachSimilarJob.title,
        }),
      )

      const updateSkillsList = updateJobDetails.skills.map(eachSkill => ({
        name: eachSkill.name,
        imageUrl: eachSkill.image_url,
      }))

      const updateCompanyDetail = {
        description: updateJobDetails.lifeAtCompany.description,
        imageUrl: updateJobDetails.lifeAtCompany.image_url,
      }

      this.setState({
        jobDetails: updateJobDetails,
        similarJobsList: updateSimilarJobsList,
        skillsList: updateSkillsList,
        companyDetail: updateCompanyDetail,
        jobDetailsApiStatus: jobDetailsApiStatusConstant.success,
      })
    } else {
      this.setState({jobDetailsApiStatus: jobDetailsApiStatusConstant.failure})
    }
  }

  // === Similar Jobs Click Function

  getSimilarJob = id => {
    this.fetchJobItemDetails(id)
  }

  // === Render - JOB DETAILS SUCCESS View

  renderJobDetailsSuccessView = () => {
    const {jobDetails, skillsList, companyDetail, similarJobsList} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetails
    return (
      <div className="job-item-details-container">
        <div className="job-item-card-container job-item-card-container-largest-view">
          <div className="company-logo-and-job-title-item">
            <img
              className="company-logo-image"
              src={companyLogoUrl}
              alt="job details company logo"
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
          <div className="description-and-website-visit-item">
            <h1 className="description-heading">Description</h1>
            <a className="visit-link" href={companyWebsiteUrl}>
              <p className="Visit-text">Visit</p>
              <BiLinkExternal size="16" color="blue" />
            </a>
          </div>
          <p className="job-description">{jobDescription}</p>
          <div>
            <h1 className="skills-heading">Skills</h1>
            <ul className="skills-container">
              {skillsList.map(eachSkill => (
                <Skills key={eachSkill.name} skillsDetails={eachSkill} />
              ))}
            </ul>
          </div>
          <div>
            <h1 className="life-at-company-heading">Life at Company</h1>
            <div className="life-at-company-container">
              <p className="life-at-company-description">
                {companyDetail.description}
              </p>
              <img
                className="life-at-company-image"
                src={companyDetail.imageUrl}
                alt="life at company"
              />
            </div>
          </div>
        </div>
        <div>
          <h1 className="similar-job-heading">Similar Jobs</h1>
          <ul className="similar-job-items-container">
            {similarJobsList.map(eachJob => (
              <SimilarJobItems
                similarJobsDetails={eachJob}
                key={eachJob.id}
                getSimilarJob={this.getSimilarJob}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  // === Render - JOB DETAILS FAILURE View

  onClickJobsRetryButton = () => {
    this.fetchJobItemDetails()
  }

  renderJobDetailsFailureView = () => (
    <div className="jobs-failure-view-container">
      <img
        className="jobs-failure-image"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="jobs-failure-error-text">Oops! Something Went Wrong</h1>
      <p className="jobs-failure-dec">
        We cannot Seem to find the page you are looking for.
      </p>
      <button
        className="jobs-failure-retry-button"
        type="button"
        onClick={this.onClickJobsRetryButton}
      >
        Retry
      </button>
    </div>
  )

  // === Render - JOB DETAILS LOADING View

  renderJobDetailsLoadingView = () => (
    <div className="job-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  // === Render - UPDATE Jobs Details API RESPONSE VIEWS

  renderUpdateJobDetailsApiResponse = () => {
    const {jobDetailsApiStatus} = this.state

    switch (jobDetailsApiStatus) {
      case jobDetailsApiStatusConstant.success:
        return this.renderJobDetailsSuccessView()

      case jobDetailsApiStatusConstant.failure:
        return this.renderJobDetailsFailureView()

      case jobDetailsApiStatusConstant.loading:
        return this.renderJobDetailsLoadingView()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-item-details-route-container">
        <Header />
        <div className="job-item-details-main-container">
          {this.renderUpdateJobDetailsApiResponse()}
        </div>
      </div>
    )
  }
}

export default JobItemDetails
