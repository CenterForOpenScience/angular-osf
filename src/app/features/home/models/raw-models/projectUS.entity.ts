export interface ProjectUS {
  title: string;
  description: string;
  category: string;
  date_created: string;
  date_modified: string;
  fork: boolean;
  tags: string[];
  current_user_permissions: string[];
  current_user_is_contributor: boolean;
  current_user_is_contributor_or_group_member: boolean;
  public: boolean;
}
