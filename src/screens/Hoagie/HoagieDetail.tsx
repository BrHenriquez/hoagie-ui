import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import {  ActivityIndicator } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { hoagies, comments } from '../../services/api';
import { Hoagie, Comment } from '../../types';
import { useUserContext } from '../../hooks/useUser';
import HoagieCardDescription from '../../components/Card/HoagieCardDescription';
import Comments from '../../components/Comment/Comments';

const HoagieDetailScreen = ({ navigation }: { navigation: NativeStackNavigationProp }) => {
  const route = useRoute();
  const { id } = route.params as { id: string };
  const { user } = useUserContext();
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
      const { data: { data } } = await hoagies.getOne(id);
      setHoagie(data);
      navigation.setOptions({
        headerTitle: data?.name ?? 'Hoagie Detail',
      });
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

  const handleDeleteComment = async (commentId: string) => {
    try {
        await comments.delete(commentId);
        await loadComments()
    } catch (error) {
        console.error('Error deleting comment:', error);
    }
}
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
      <HoagieCardDescription
        hoagie={hoagie}
      />
      <Comments
        commentList={commentList}
        commentLoading={commentLoading}
        newComment={newComment}
        setNewComment={setNewComment}
        handleAddComment={handleAddComment}
        handleDeleteComment={handleDeleteComment}
        user={user}
        />
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
  loader: {
    marginVertical: 20,
  },
});

export default HoagieDetailScreen; 