import api from './api';

export interface SubmitRatingPayload {
  target_type: 'destination' | 'accommodation';
  target_id: number;
  trip_id?: number;
  cleanliness: number; // 1-5
  environmental_condition: number; // 1-5
  environmental_care: number; // 1-5
  review_comment?: string;
}

export interface RatingResponse {
  eco_score: number;
  rating_count: number;
  ratings: any[];
}

export const ratingService = {
  async submitRating(payload: SubmitRatingPayload): Promise<any> {
    const res = await api.post('/ratings', payload);
    return res.data;
  },

  async getRatings(targetType: 'destination' | 'accommodation', targetId: number | string): Promise<RatingResponse> {
    const res = await api.get<RatingResponse>('/ratings', {
      params: { target_type: targetType, target_id: targetId },
    });
    return res.data;
  },
};
