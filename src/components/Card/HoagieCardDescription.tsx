import React, { useMemo, useState } from "react"
import { Image, StyleSheet, Text, View } from "react-native"
import { Button, Card } from "react-native-paper"
import { Hoagie } from "../../types"
import AddCollaboratorModal from "../Modal/AddCollaborator";
import { hoagieColors } from "../../theme/theme";
import { useUserContext } from "../../hooks/useUser";

type HoagieCardDescriptionProps = {
  hoagie: Hoagie;
  isOwner: boolean;
  fetchDetails: () => void;
}

const HoagieCardDescription = ({ hoagie, isOwner, fetchDetails }: HoagieCardDescriptionProps) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { user } = useUserContext();

  return (
    <Card style={styles.card}>
      <Card.Content>
        {hoagie?.picture && (
          <Image source={{ uri: hoagie.picture }} style={styles.image} />
        )}
        <Text style={styles.title}>{hoagie?.name}</Text>
        <Text style={styles.creator}>Created by {hoagie?.creator?.name === user?.name ? 'you' : hoagie?.creator?.name ?? 'Unknown'}</Text>
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
                • {collaborator.name === user?.name ? 'you' : collaborator.name}
              </Text>
            ))}
          </>
        )}
        {isOwner ? <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={() =>  setOpenModal(true)} textColor={hoagieColors.text}>
            <Text>Add collaborator</Text>
          </Button>
        </View> : null}
        {openModal && <AddCollaboratorModal open={openModal} onDismiss={() => setOpenModal(false)} hoagie={hoagie} fetchDetails={fetchDetails} />}
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
  buttonContainer: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
});
