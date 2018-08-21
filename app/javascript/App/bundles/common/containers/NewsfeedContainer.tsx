import * as React from 'react'
import localAPI from '../../../lib/localAPI'
import normalizers from '../../../normalizers'
import NewsfeedContext, { NewsfeedContextType } from '../../../contexts/NewsfeedContext'
import { NewsItem, ContentType } from '../../NewsfeedPage/types';

const STATUSES = {
  INITIALIZING: 'INITIALIZING',
  LOADING: 'LOADING',
  LOADING_MORE_ITEMS: 'LOADING_MORE_ITEMS',
  NEW_NEWS_ITEMS_LOADING: 'NEW_NEWS_ITEMS_LOADING',
  READY: 'READY',
};

type Props = {
  coinSlug?: string,
  newsItemId?: string,
};

type State = {
  status: string,
  sortedNewsItems: Array<NewsItem>, 
};

class NewsfeedContainer extends React.Component<Props, State> {
  state = {
    status: STATUSES.INITIALIZING,
    sortedNewsItems: [],
  }

  sortNewsFunc(x: NewsItem, y: NewsItem) {
    return Date.parse(y.feed_item_published_at) - Date.parse(x.feed_item_published_at)
  }

  fetchNewNewsItems = () => {
    if (this.state.sortedNewsItems.length === 0) return Promise.resolve();

    const firstNewsItem = this.state.sortedNewsItems[0];

    return new Promise((resolve, _reject) => {
      this.setState({
        status: STATUSES.NEW_NEWS_ITEMS_LOADING
      }, () => {
        localAPI.get('/news', { publishedSince: firstNewsItem.feed_item_published_at }).then((response) => {
          this.setState({
            status: STATUSES.READY,
            sortedNewsItems: [...response.payload.sort(this.sortNewsFunc), ...this.state.sortedNewsItems],
          }, () => resolve(response.payload.sort(this.sortNewsFunc)))
        })
      })
    });
  }

  fetchAllNewsItems = () => {
    return new Promise((resolve, _reject) => {
      this.setState({
        status: STATUSES.LOADING,
      },() => {
        localAPI.get('/news', { publishedUntil: '2018-08-10T06:42:54.000Z' }).then((response) => {
          const sortedNewsItems = response.payload.sort(this.sortNewsFunc);
          this.setState({
            status: STATUSES.READY,
            sortedNewsItems
          }, () => resolve(sortedNewsItems))
        })
      })
    })
  }

  fetchNewsItemsForCoin = (coinSlug) => {
    return new Promise((resolve, _reject) => {
      this.setState({
        status: STATUSES.LOADING,
      }, () => {
        localAPI.get(`/news?coinSlugs=${coinSlug}`).then((response) => {
          const sortedNewsItems = response.payload.sort(this.sortNewsFunc);
          this.setState({
            status: STATUSES.READY,
            sortedNewsItems
          }, () => resolve(sortedNewsItems))
        })
      })
    })
  }

  fetchMoreNewsItems = () => {
    return new Promise((resolve, _reject) => {
      const lastNews = this.state.sortedNewsItems[this.state.sortedNewsItems.length - 1];
      this.setState({
          status: STATUSES.LOADING_MORE_ITEMS
        }, () => localAPI.get(`/news`, { publishedUntil: lastNews.publishedUntil }).then(response => {
            this.setState({
              status: STATUSES.READY,
              sortedNewsItems: [...this.state.sortedNewsItems, ...response.payload.sort(this.sortNewsFunc)]
            }, () => resolve(response.payload.sort(this.sortNewsFunc)))
        })
      );
    })
  }

  render = () => {

    const payload: NewsfeedContextType = {
      status: this.state.status,
      newslist: this.state.sortedNewsItems,
      isLoading: this.state.status === STATUSES.LOADING,
      isLoadingMoreItems: this.state.status === STATUSES.LOADING_MORE_ITEMS,
      isReady: this.state.status === STATUSES.READY,
      fetchNewsItemsForCoin: this.fetchNewsItemsForCoin,
      fetchMoreNewsItems: this.fetchMoreNewsItems,
      fetchAllNewsItems: this.fetchAllNewsItems,
      fetchNewNewsItems: this.fetchNewNewsItems,
   };

    return (
      <NewsfeedContext.Provider value={payload}>
        {this.props.children}
      </NewsfeedContext.Provider>
    )
  };
}

export default NewsfeedContainer
