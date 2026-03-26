public class Solution {
    public double func(double a, double b){
        double mpsSpeed = (a * 1000) / 3600;

        return (mpsSpeed * b) + ((mpsSpeed * mpsSpeed) / 20);
    }
}