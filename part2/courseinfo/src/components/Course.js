const Header = ({ course }) => <h1>{course}</h1>;

const Total = ({ sum }) => <p>Number of exercises {sum}</p>;

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Content = ({ parts }) => (
  <>
    {parts.map((part) => (
      <Part part={part} key={part.id} />
    ))}
    <Total
      sum={parts.reduce(
        (accumulator, currentValue) => accumulator + currentValue.exercises,
        0
      )}
    />
  </>
);

const Course = ({ course }) => (
  <>
    <Header course={course.name} />
    <Content parts={course.parts} />
  </>
);

export default Course;