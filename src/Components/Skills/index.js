import './index.css'

const Skills = props => {
  const {skillsDetails} = props
  const {name, imageUrl} = skillsDetails

  return (
    <li className="skill-item">
      <img className="skill-logo-image" src={imageUrl} alt={name} />
      <p className="skill-name">{name}</p>
    </li>
  )
}

export default Skills
