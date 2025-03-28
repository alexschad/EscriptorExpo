import uuid from 'react-native-uuid';
import { ArticleListType, ArticleActionType } from '@/shared/Types';
import storage from '@/shared/Storage';

export enum ACTIONS {
  INIT_DATA = 'init_data',
  ADD_ARTICLE = 'add_article',
  EDIT_ARTICLE_HTML = 'edit_article_html',
  EDIT_ARTICLE_METADATA = 'edit_article_metadata',
  DELETE_ARTICLE = 'delete_article',
}

const reducer = (
  articles: ArticleListType,
  action: ArticleActionType,
): ArticleListType => {
  switch (action.type) {
    // initialize
    case ACTIONS.INIT_DATA:
      return action.payload.articles || [];
    // add new article
    case ACTIONS.ADD_ARTICLE: {
      console.log('ADD ARTICLE ', {
        id: uuid.v4() as string,
        title: action.payload.title || '',
        description: action.payload.description || '',
        featureImage: action.payload.featureImage || '',
        html: '',
        created: Date.now(),
      });
      return [
        {
          id: uuid.v4() as string,
          title: action.payload.title || '',
          description: action.payload.description || '',
          featureImage: action.payload.featureImage || '',
          html: '',
          created: Date.now(),
        },
        ...articles,
      ];
    }
    // edit article html
    case ACTIONS.EDIT_ARTICLE_HTML: {
      console.log(
        'EDIT ARTICLE HTML',
        action.payload.articleId,
        action.payload.html,
      );
      return articles.map(l => {
        if (l.id === action.payload.articleId) {
          return {
            id: l.id,
            title: l.title,
            description: l.description,
            featureImage: l.featureImage,
            html: action.payload.html || '',
            created: l.created,
          };
        }
        return l;
      });
    }
    // edit article metadata
    case ACTIONS.EDIT_ARTICLE_METADATA: {
      return articles.map(l => {
        if (l.id === action.payload.articleId) {
          return {
            id: l.id,
            title: action.payload.title || '',
            description: action.payload.description || '',
            featureImage: action.payload.featureImage || '',
            html: l.html,
            created: l.created,
          };
        }
        return l;
      });
    }
    // delete article
    case ACTIONS.DELETE_ARTICLE: {
      return articles.filter(l => l.id !== action.payload.articleId);
    }
    default:
      return articles;
  }
};

export const withMMKVStorageCache = (r: any) => {
  return (articles: ArticleListType, action: ArticleActionType) => {
    const newState = r(articles, action);
    storage.set('escriptorArticles', JSON.stringify(newState));
    return newState;
  };
};

export default reducer;
