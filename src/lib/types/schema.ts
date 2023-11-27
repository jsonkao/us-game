export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
			Game: {
				Row: {
					created_at: string;
					id: number;
				};
				Insert: {
					created_at?: string;
					id?: number;
				};
				Update: {
					created_at?: string;
					id?: number;
				};
				Relationships: [];
			};
			Move: {
				Row: {
					action: string;
					args: Json;
					created_at: string;
					game: number;
					id: number;
					storeName: Database['public']['Enums']['storeName'];
				};
				Insert: {
					action: string;
					args: Json;
					created_at?: string;
					game: number;
					id?: number;
					storeName: Database['public']['Enums']['storeName'];
				};
				Update: {
					action?: string;
					args?: Json;
					created_at?: string;
					game?: number;
					id?: number;
					storeName?: Database['public']['Enums']['storeName'];
				};
				Relationships: [
					{
						foreignKeyName: 'Move_game_fkey';
						columns: ['game'];
						isOneToOne: false;
						referencedRelation: 'Game';
						referencedColumns: ['id'];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			storeName: 'cardStore' | 'tokenStore' | 'nobleStore' | 'playerStore';
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}

// Schema: public
// Enums
export enum StoreName {
	cardStore = 'cardStore',
	tokenStore = 'tokenStore',
	nobleStore = 'nobleStore',
	playerStore = 'playerStore'
}

// Tables
export type Game = Database['public']['Tables']['Game']['Row'];
export type InsertGame = Database['public']['Tables']['Game']['Insert'];
export type UpdateGame = Database['public']['Tables']['Game']['Update'];

export type Move = Database['public']['Tables']['Move']['Row'];
export type InsertMove = Database['public']['Tables']['Move']['Insert'];
export type UpdateMove = Database['public']['Tables']['Move']['Update'];
