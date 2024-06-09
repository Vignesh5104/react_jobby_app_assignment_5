import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'

import './index.css'
import Header from '../Header'
import JobItems from '../JobItems'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const profileApiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

const jobsApiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

const employmentIdList = []

class Jobs extends Component {
  state = {
    profileDetails: {},
    profileApiStatus: profileApiStatusConstant.initial,
    searchResult: '',
    searchText: '',
    getEmploymentTypeId: '',
    getSalaryRangeId: '',
    jobsCategoryDetailsList: [],
    jobsApiStatus: jobsApiStatusConstant.initial,
  }

  componentDidMount() {
    this.fetchProfileData()
    this.fetchJobsFilterData()
  }

  // FETCH DATA - AUTHORIZATION USER PROFILE -----------------------------------

  fetchProfileData = async () => {
    this.setState({profileApiStatus: profileApiStatusConstant.loading})

    const profileApi = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(profileApi, options)

    if (response.ok === true) {
      const profileData = await response.json()

      const updateProfileData = {
        name: profileData.profile_details.name,
        profileImageUrl: profileData.profile_details.profile_image_url,
        shortBio: profileData.profile_details.short_bio,
      }
      this.setState({
        profileDetails: updateProfileData,
        profileApiStatus: profileApiStatusConstant.success,
      })
    } else {
      this.setState({profileApiStatus: profileApiStatusConstant.failure})
    }
  }

  // === Render Profile SUCCESS View

  renderProfileSuccessView = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="profile-container">
        <img
          className="profile-logo-image"
          src={profileImageUrl}
          alt="profile logo"
        />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-short-bio">{shortBio}</p>
      </div>
    )
  }

  // === Render - Profile FAILURE View

  onClickRetryButton = () => {
    this.fetchProfileData()
  }

  renderProfileFailureView = () => (
    <div className="retry-button-container">
      <button
        className="retry-button"
        type="button"
        onClick={this.onClickRetryButton}
      >
        Retry
      </button>
    </div>
  )

  // === Render - Profile LOADING View

  renderProfileLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  // === Render - UPDATE PROFILE API RESPONSE VIEWS

  renderUpdateProfileApiResponse = () => {
    const {profileApiStatus} = this.state

    switch (profileApiStatus) {
      case profileApiStatusConstant.success:
        return this.renderProfileSuccessView()

      case profileApiStatusConstant.failure:
        return this.renderProfileFailureView()

      case profileApiStatusConstant.loading:
        return this.renderProfileLoadingView()

      default:
        return null
    }
  }

  // FETCH DATA - FILTER THE JOB CATEGORY --------------------------------------

  fetchJobsFilterData = async () => {
    const {getEmploymentTypeId, getSalaryRangeId, searchResult} = this.state

    this.setState({jobsApiStatus: jobsApiStatusConstant.loading})

    const jobsApi = `https://apis.ccbp.in/jobs?employment_type=${getEmploymentTypeId}&minimum_package=${getSalaryRangeId}&search=${searchResult}`

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }

    const response = await fetch(jobsApi, options)

    if (response.ok === true) {
      const jobsData = await response.json()

      const updateJobsData = jobsData.jobs.map(eachDetails => ({
        companyLogoUrl: eachDetails.company_logo_url,
        employmentType: eachDetails.employment_type,
        id: eachDetails.id,
        jobDescription: eachDetails.job_description,
        location: eachDetails.location,
        packagePerAnnum: eachDetails.package_per_annum,
        rating: eachDetails.rating,
        title: eachDetails.title,
      }))

      this.setState({
        jobsCategoryDetailsList: updateJobsData,
        jobsApiStatus: jobsApiStatusConstant.success,
      })
    } else {
      this.setState({jobsApiStatus: jobsApiStatusConstant.failure})
    }
  }

  // === Render Filter the JOB Category

  onChangeCheckedEmploymentType = event => {
    if (event.target.checked) {
      employmentIdList.push(event.target.id)
      this.setState(
        {getEmploymentTypeId: employmentIdList.join()},
        this.fetchJobsFilterData,
      )
    } else {
      const index = employmentIdList.findIndex(
        eachIndex => eachIndex === event.target.id,
      )
      employmentIdList.splice(index, 1)
      this.setState(
        {getEmploymentTypeId: employmentIdList.join()},
        this.fetchJobsFilterData,
      )
    }
  }

  onChangeCheckedSalaryRange = event => {
    this.setState({getSalaryRangeId: event.target.id}, this.fetchJobsFilterData)
  }

  renderCategoryFilter = () => (
    <>
      <ul className="employment-types-container">
        <h1 className="employment-heading">Type of Employment</h1>
        {employmentTypesList.map(eachEmployment => (
          <li className="employment-item" key={eachEmployment.employmentTypeId}>
            <input
              type="checkbox"
              id={eachEmployment.employmentTypeId}
              className="check-box-element"
              onChange={this.onChangeCheckedEmploymentType}
              value={eachEmployment.label}
            />
            <label
              htmlFor={eachEmployment.employmentTypeId}
              className="employment-label"
            >
              {eachEmployment.label}
            </label>
          </li>
        ))}
      </ul>
      <ul className="salary-range-container">
        <h1 className="salary-range-heading">Salary Range</h1>
        {salaryRangesList.map(eachSalaryRange => (
          <li className="salary-range-item" key={eachSalaryRange.salaryRangeId}>
            <input
              type="radio"
              id={eachSalaryRange.salaryRangeId}
              className="radio-button"
              name="choose"
              onChange={this.onChangeCheckedSalaryRange}
              value={eachSalaryRange.label}
            />
            <label
              htmlFor={eachSalaryRange.salaryRangeId}
              className="salary-range-label"
              name="choose"
            >
              {eachSalaryRange.label}
            </label>
          </li>
        ))}
      </ul>
    </>
  )

  // Search Result Filter the Jobs

  onClickSearchIcon = () => {
    const {searchText} = this.state
    this.setState({searchResult: searchText}, this.fetchJobsFilterData)
  }

  onKeyDownSearchInput = event => {
    if (event.key === 'Enter') {
      this.setState(
        {searchResult: event.target.value},
        this.fetchJobsFilterData,
      )
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchText: event.target.value})
  }

  // === Render - JOBS SUCCESS View

  renderJobsSuccessView = () => {
    const {jobsCategoryDetailsList} = this.state

    const noJobs = jobsCategoryDetailsList.length === 0

    return noJobs ? (
      <div className="not-found-job-container">
        <img
          className="not-found-job-image"
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1 className="not-found-job-text">No Jobs Found</h1>
        <p className="not-found-job-dec">
          We could not find any jobs, Try other filters.
        </p>
      </div>
    ) : (
      <ul className="jobs-items-container">
        {jobsCategoryDetailsList.map(eachJobItem => (
          <JobItems jobItemDetails={eachJobItem} key={eachJobItem.id} />
        ))}
      </ul>
    )
  }

  // === Render - JOBS FAILURE View

  onClickJobsRetryButton = () => {
    this.fetchJobsFilterData()
  }

  renderJobsFailureView = () => (
    <div className="jobs-failure-view-container">
      <img
        className="jobs-failure-image"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="jobs-failure-error-text">Oops! Something Went Wrong</h1>
      <p className="jobs-failure-dec">
        We cannot seem to find the page you are looking for
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

  // === Render - JOBS LOADING View

  renderJobsLoadingView = () => (
    <div className="loader-job-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  // === Render - UPDATE Jobs Types API RESPONSE VIEWS

  renderUpdateJobsCategoryApiResponse = () => {
    const {jobsApiStatus} = this.state

    switch (jobsApiStatus) {
      case jobsApiStatusConstant.success:
        return this.renderJobsSuccessView()

      case jobsApiStatusConstant.failure:
        return this.renderJobsFailureView()

      case jobsApiStatusConstant.loading:
        return this.renderJobsLoadingView()

      default:
        return null
    }
  }
  // ===Render Display Job View Status

  // Render - ( JOBS View ).. or..( Noo JOB View )

  renderDisplayJobViewStatus = () => {}

  // === RENDER

  render() {
    return (
      <div className="jobs-route-container">
        <Header />
        <div className="jobs-page-container">
          <div className="profile-and-filter-section-container">
            <div className="profile-section-container">
              {this.renderUpdateProfileApiResponse()}
            </div>
            <div className="job-category-filter-section-container">
              {this.renderCategoryFilter()}
            </div>
          </div>
          <div className="jobs-main-section-container">
            <div className="search-section-container">
              <div className="search-container">
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search"
                  onKeyDown={this.onKeyDownSearchInput}
                  onChange={this.onChangeSearchInput}
                />
                <button
                  data-testid="searchButton"
                  type="button"
                  className="search-button"
                  onClick={this.onClickSearchIcon}
                >
                  <BsSearch className="search-icon" />
                </button>
              </div>
            </div>
            <div className="jobs-list-section-container">
              {this.renderUpdateJobsCategoryApiResponse()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
