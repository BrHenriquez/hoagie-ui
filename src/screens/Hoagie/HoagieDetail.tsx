import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, RefreshControl } from 'react-native';
import { Text, Card, Button, TextInput, ActivityIndicator } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { hoagies, comments } from '../../services/api';
import { Hoagie, Comment } from '../../types';

const HoagieDetailScreen = ({navigation}: {navigation: NativeStackNavigationProp<any>}) => {
  const route = useRoute();
  const { id } = route.params as { id: string };

  const [hoagie, setHoagie] = useState<Hoagie | null>(null);
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    getDetails();
  }, [id]);

  const getDetails = async () => {
    await loadHoagie();
    await loadComments();
  }

  const loadHoagie = async () => {
    try {
      setLoading(true);
      const {data: {data}} = await hoagies.getOne(id);
      setHoagie(data);
    } catch (error) {
      console.error('Error loading hoagie:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      setCommentLoading(true);
      const response = await comments.getByHoagie(id);
      setCommentList(response.data.data);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await comments.create(id, newComment.trim());
      setNewComment('');
      loadComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!hoagie) {
    return null;
  }

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={loading} onRefresh={() => getDetails()} />}>     
      <Card style={styles.card}>
        <Card.Content>
          {hoagie?.picture && (
            <Image source={{ uri: hoagie.picture }} style={styles.image} />
          )}
          <Text style={styles.title}>{hoagie?.name?? 'No name'}</Text>
          <Text style={styles.creator}>Created by: {hoagie?.creator?.name?? 'Unknown'}</Text>
          <Text style={styles.sectionTitle}>Ingredients:</Text>
          {hoagie?.ingredients?.length > 0 ? hoagie?.ingredients?.map((ingredient, index) => (
            <Text key={index} style={styles.ingredient}>
              • {ingredient}
            </Text>
          )) : <Text>No ingredients</Text>}
          {hoagie?.collaborators?.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Collaborators:</Text>
              {hoagie?.collaborators?.map(collaborator => (
                <Text key={collaborator._id} style={styles.collaborator}>
                  • {collaborator.name}
                </Text>
              ))}
            </>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.commentsCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Comments</Text>
          {commentLoading ? (
            <ActivityIndicator style={styles.loader} />
          ) : (
            commentList?.length > 0 ? commentList?.map(comment => (
              <View key={comment._id} style={styles.comment}>
                <Text style={styles.commentAuthor}>{comment?.user?.name ?? 'Unknown'}</Text>
                <Text style={styles.commentText}>{comment?.text}</Text>
                <Text style={styles.commentDate}>
                  {new Date(comment?.createdAt).toLocaleDateString()}
                </Text>
              </View>
            )) : <Text style={{textAlign: 'center'}}>No comments yet</Text>
          )}

          <TextInput
            label="Add a comment"
            value={newComment}
            onChangeText={setNewComment}
            style={styles.commentInput}
            multiline
          />
          <Button
            mode="contained"
            onPress={handleAddComment}
            disabled={!newComment.trim()}
            style={styles.commentButton}
          >
            Post Comment
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 8,
  },
  card: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  creator: {
    color: '#666',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  ingredient: {
    marginLeft: 10,
    marginBottom: 5,
  },
  collaborator: {
    marginLeft: 10,
    marginBottom: 5,
  },
  commentsCard: {
    marginBottom: 20,
  },
  comment: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  commentAuthor: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  commentText: {
    marginBottom: 5,
  },
  commentDate: {
    color: '#666',
    fontSize: 12,
  },
  commentInput: {
    marginTop: 10,
    marginBottom: 10,
  },
  commentButton: {
    marginTop: 5,
  },
  loader: {
    marginVertical: 20,
  },
});

export default HoagieDetailScreen; 