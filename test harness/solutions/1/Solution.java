public class Solution {
    public double[] func(double a, double b, double c){
        double mean = (a + b + c) / 3;
        double a1 = a - mean;
        double a2 = b - mean;
        double a3 = c - mean;
        double sum = a1 + a2 + a3;
        double sd = Math.sqrt((sum * sum) / 3);

        return new double[]{mean, sd};
    }
}