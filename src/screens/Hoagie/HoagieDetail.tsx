import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { ActivityIndicator, Button } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { hoagies, comments } from '../../services/api';
import { Hoagie, Comment } from '../../types';
import { useUserContext } from '../../hooks/useUser';
import HoagieCardDescription from '../../components/Card/HoagieCardDescription';
import Comments from '../../components/Comment/Comments';
import { hoagieColors } from '../../theme/theme';
import { Screens } from '../../constants/screens';
import { RootStackParamList } from '../../Navigator/MainNavigator';

const HoagieDetailScreen = ({ navigation }: { navigation: NativeStackNavigationProp }) => {
  const route = useRoute();
  const { id } = route.params as { id: string };
  const { user } = useUserContext();
  const [hoagie, setHoagie] = useState<Hoagie | null>(null);
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [commentLoading, setCommentLoading] = useState<boolean>(false);
  const isOwner = useMemo(() => {
    return hoagie?.creator?._id === user?._id;
  }, [hoagie?.creator?._id, user?._id]);

  useEffect(() => {
    getDetails();
  }, []);

  const loadHoagie = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { data } } = await hoagies.getOne(id);
      setHoagie(data);
    } catch (error) {
      console.error('Error loading hoagie:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadComments = useCallback(async () => {
    try {
      setCommentLoading(true);
      const response = await comments.getByHoagie(id);
      setCommentList(response.data.data);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setCommentLoading(false);
    }
  }, [id]);

  const getDetails = useCallback(async () => {
    await loadHoagie();
    await loadComments();
  }, [id, loadHoagie, loadComments]);

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
      {isOwner ? (
        <View style={styles.headerContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate(Screens.HOAGIE_FORM, { isEdit: true, hoagie })}
            textColor={hoagieColors.text}
          >
            Edit
          </Button>
        </View>
      ) : null}
      <HoagieCardDescription
        hoagie={hoagie}
        isOwner={isOwner}
        fetchDetails={getDetails}
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
});

export default HoagieDetailScreen; 