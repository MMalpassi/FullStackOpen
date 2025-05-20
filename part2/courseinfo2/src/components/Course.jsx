const Header = (props) => <h2>{props.course.name}</h2>

const Content = (props) => (
  <div>
    <Part part={props.parts} />
  </div>
)

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Total = (props) => <ul><strong>Total of {props.total} exercises</strong></ul>

const Course = (props) => (
    <div>
      <Header course={props.course}/>
      <ul>
        {props.course.parts.map(part => 
          <Content key={part.id} parts={part}/>
        )}
      </ul>
      <Total total={props.course.parts.reduce((sum,part) => sum + part.exercises, 0)}/>
    </div>
)

export default Course