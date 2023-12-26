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
