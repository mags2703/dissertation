public class Solution {
    public double[] func(double a, double b, double c){
        double mean = (a + b + c) / 3;
        double a1 = a - mean;
        a1 = a1 * a1;
        double a2 = b - mean;
        a2 = a2 * a2;
        double a3 = c - mean;
        a3 = a3 * a3;
        double sum = a1 + a2 + a3;
        double sd = Math.sqrt(sum / 3);

        return new double[]{mean, sd};
    }
}