import React from "react"
import { Image, StyleSheet, Text } from "react-native"
import { Card } from "react-native-paper"
import { Hoagie } from "../../types"

const HoagieCardDescription = ({hoagie}: {hoagie: Hoagie}) => {
    return (
        <Card style={styles.card}>
        <Card.Content>
          {hoagie?.picture && (
            <Image source={{ uri: hoagie.picture }} style={styles.image} />
          )}
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
    )
}

export default HoagieCardDescription;

const styles = StyleSheet.create({
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
  });
