import { PureComponent } from "react";
import { View, Text, ScrollView } from "react-native";
import Error from "../../component/Error";
import LoadingIndicator from "../../component/LoadingIndicator";
import { errorHandler, TabNews } from "../../libs/tabnews";
import Markdown from 'react-native-markdown-display';
import styles from "./styles";
import CommentsContainer from "./CommentsContainer";
import striptags from "striptags";


class PostScreen extends PureComponent {
  tabnews = new TabNews()
  state = {
    loading: true,
    error: null,
    postComponent: null
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.loadData();
  }

  reload() {
    this.setState({ loading: true }, this.loadData);
  }

  loadData() {
    const { post } = this.props.route.params;
    this.tabnews.getPost(post.owner, post.slug)
      .then(data => this.processMarkdown(data))
      .catch(err => this.setState({ loading: false, error: errorHandler(err) }));
  }

  processMarkdown(post) {
    const stripedContent = striptags(post.body, ['a']);
    this.setState({
      postComponent: (
        <ScrollView>
          <Text style={styles.title}>{post.title}</Text>
          <Markdown children={stripedContent} />
          <Text style={styles.comments}>Comentários:</Text>
          <CommentsContainer
            post={{ owner: post.owner_username, slug: post.slug }}
          />
        </ScrollView>
      ),
      loading: false
    })
  }

  render() {
    return (
      <View style={styles.root}>
        {this.state.loading ? (
          <LoadingIndicator />
        ) : (this.state.error ? (
          <Error message={this.state.error} onRetry={() => this.reload()} />
        ) : this.state.postComponent)}
      </View>
    )
  }
}

export default PostScreen;