/**
 * Fare Calculation Service
 * 
 * Business logic for calculating taxi fares based on:
 * - Distance (km)
 * - Vehicle type pricing
 * - Base fare
 * - Time of day (surge pricing)
 * - Day of week
 */

interface FareCalculationParams {
  distance: number;
  pricePerKm: number;
  baseFare: number;
}

export class FareService {
  /**
   * Calculate fare with surge pricing
   */
  static calculateFare(params: FareCalculationParams): number {
    const { distance, pricePerKm, baseFare } = params;
    
    // Base calculation
    let fare = baseFare + (distance * pricePerKm);
    
    // Apply surge pricing based on time
    const surgeMultiplier = this.getSurgeMultiplier();
    fare *= surgeMultiplier;
    
    // Round to 2 decimal places
    return Math.round(fare * 100) / 100;
  }

  /**
   * Get surge multiplier based on current time
   * Peak hours: 7-10 AM, 5-8 PM on weekdays
   */
  private static getSurgeMultiplier(): number {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Weekend: slight surge
    if (day === 0 || day === 6) {
      return 1.2;
    }
    
    // Weekday peak hours
    if ((hour >= 7 && hour < 10) || (hour >= 17 && hour < 20)) {
      return 1.5;
    }
    
    // Late night
    if (hour >= 22 || hour < 6) {
      return 1.3;
    }
    
    // Normal hours
    return 1.0;
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   * Returns distance in kilometers
   */
  static calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 100) / 100;
  }

  private static toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
