interface Problem {
  id: number;
  title: string;
  description: string;
  params: number;
  header: string;
}

const bmiProblem: Problem = {
  id: 0,
  title: 'BMI Calculator',
  description:
    'Write a function that computes the BMI of a person. The BMI is computed by dividing the weight of a person (in kgs) by the square of the height of the person in meters. They are the parameters a and b respectively',
  params: 2,
  header: 'double func(double a, double b)',
};

const averageAndSD: Problem = {
  id: 1,
  title: 'Average and Standard Deviation Calculator',
  description:
    'Write a function which takes in 3 numbers (a, b and c) and computes their average and standard deviation and returns an array in the format [average, sd]',
  params: 3,
  header: 'double[] func(double a, double b, double c)',
};

const stoppingDistance: Problem = {
  id: 2,
  title: 'Stopping Distance Calculator',
  description:
    'Write a function to compute how long it would take in metres to stop a vehicle based on the speed that it is travelling at (in kilometres per hour) and the reaction time of the driver (in seconds).  The stopping distance is to be computed as the sum of the reaction distance (which is the speed in metres per second times the reaction time in seconds) and the braking distance (which is the square of the speed in metres per second divided by 20). Speed is a. Reaction time is b',
  params: 2,
  header: 'double func(double a, double b)',
};

const advancedStoppingDistance: Problem = {
  id: 3,
  title: 'Advanced Stopping Distance Calculator',
  description: `Write a function to compute how long it would take in metres to stop a vehicle based on
		a. the speed that it is travelling at (in kilometres per hour),
		b. the age of the driver,
		c. whether the road is wet or dry (wet is true, dry is false).

    Assume that the reaction time of the driver (in seconds) is 2.0 seconds if the driver is less than 50 years old, is 2.5 seconds if the driver is between 50 and 59 years old, and is 3.0 seconds if the driver is 60 or older.
    The braking distance is the square of the speed of the vehicle (in kilometres per hour) divided by 250 times the coefficient of friction.
    You may assume that the vehicle is travelling on a tarmac road and that the coefficient of friction for a tarmac road is 0.8 if the road is dry and 0.4 if the road is wet.
    The stopping distance is to be computed as the sum of the reaction distance (which is the speed in metres per second times the reaction time in seconds) and the braking distance.`,
  params: 3,
  header: 'double func(double a, double b, boolean c)',
};

const problems = [
  bmiProblem,
  averageAndSD,
  stoppingDistance,
  advancedStoppingDistance,
];

export default problems;
