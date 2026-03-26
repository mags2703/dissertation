public class Solution {
    public double func(double a, double b, boolean c){
        double mpsSpeed = (a * 1000) / 3600;
        double reactionTime = b < 50 ? 2 : (b < 60 ? 2.5 : 3);
        double coef = c ? 0.4 : 0.8;
        double brakingDistance = Math.pow(a, 2) / (250 * coef);

        return (mpsSpeed * reactionTime) + brakingDistance;
    }
}