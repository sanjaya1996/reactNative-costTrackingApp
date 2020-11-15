import React, { useState, useEffect, useCallback } from 'react';
import {
  FlatList,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  Text,
  StyleSheet,
  Platform,
  Alert,
  Button,
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';

import HeaderButton from '../components/HeaderButton';
import LoadingSpinner from '../components/LoadingSpinner';
import * as projectsActions from '../store/actions/projects';
import Colors from '../constant/Colors';

const ProjectHistoryScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const dispatch = useDispatch();

  const loadHistoryProjects = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(projectsActions.fetchHistoryProjects());
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      'willFocus',
      loadHistoryProjects
    );

    return () => {
      willFocusSub.remove();
    };
  }, [loadHistoryProjects]);

  useEffect(() => {
    let unmounted = false;
    loadHistoryProjects().then(() => {
      if (!unmounted) {
        setIsLoading(false);
      }
    });
    return () => {
      unmounted = true;
    };
  }, [dispatch, loadHistoryProjects]);

  const userHistoryProjects = useSelector(
    (state) => state.projects.userHistoryProjects
  );

  const userProjectClients = useSelector((state) => state.clients.clients);

  const deleteConfirmedHandler = async (historyId) => {
    setIsLoading(true);
    await dispatch(projectsActions.deleteHistoryProject(historyId));

    setIsLoading(false);
  };

  const deleteProjectHandler = (historyId) => {
    Alert.alert(
      'Are you sure?',
      'Do you really want to delete project? Because, you will loose everything belongs to this project!',
      [
        { text: 'No', style: 'default' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => deleteConfirmedHandler(historyId),
        },
      ]
    );
  };

  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occured!</Text>
        <Button title='Try again' onPress={loadHistoryProjects} />
      </View>
    );
  }

  if (!isLoading && userHistoryProjects.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={{ fontFamily: 'open-sans' }}>
          You don't have any Previous Projects!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        keyExtractor={(item) => item._id}
        data={userHistoryProjects}
        renderItem={(itemData) => {
          const project = itemData.item.finishedProject;
          const projectClient = userProjectClients.find(
            (client) => client.projectId === project.id
          );

          return (
            <View style={styles.gridItem}>
              <TouchableCmp
                style={{ flex: 1 }}
                onPress={() =>
                  props.navigation.navigate({
                    routeName: 'PreviousProjectHome',
                    params: { projectId: project._id },
                  })
                }
              >
                <View style={styles.card}>
                  <View style={styles.title}>
                    <Text style={styles.titleText}>{project.title}</Text>
                  </View>

                  <View style={styles.cardFooter}>
                    <View style={styles.dataContainer}>
                      <Text style={styles.labelText}>Client: </Text>
                      {projectClient ? (
                        <Text style={styles.valueText}>
                          {projectClient.firstName +
                            ' ' +
                            projectClient.lastName}
                        </Text>
                      ) : (
                        <Text style={styles.valueText}>No client!</Text>
                      )}
                    </View>
                    <View style={styles.dataContainer}>
                      <Text style={styles.labelText}>Completed: </Text>
                      <Text style={styles.valueText}> 17 Aug 2020</Text>
                    </View>
                    <View style={styles.deleteButton}>
                      <Ionicons
                        name='ios-remove-circle-outline'
                        size={24}
                        color='red'
                        onPress={() => deleteProjectHandler(itemData.item._id)}
                      />
                    </View>
                  </View>
                </View>
              </TouchableCmp>
            </View>
          );
        }}
      />
    </View>
  );
};

ProjectHistoryScreen.navigationOptions = (navData) => {
  return {
    headerTitle: 'Completed Projects',
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title='Menu'
          iconName='ios-menu'
          color='white'
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  screen: {
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    // backgroundColor: "rgba(0,0,0,0.75)",
    backgroundColor: 'white',
    margin: 10,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
    borderRadius: 10,
  },
  gridItem: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },

  title: {
    alignItems: 'center',
    padding: 10,
  },
  titleText: {
    color: Colors.buttonColor,
    fontFamily: 'open-sans-bold',
    fontSize: 20,
    textDecorationLine: 'underline',
  },
  viewButton: {
    alignItems: 'center',
    marginVertical: 10,
  },
  cardFooter: {
    padding: 10,
  },
  dataContainer: {
    flexDirection: 'row',
    padding: 5,
  },
  labelText: {
    fontFamily: 'open-sans-bold',
  },
  valueText: {
    fontFamily: 'open-sans',
  },
  deleteButton: {
    alignSelf: 'flex-end',
  },
});
export default ProjectHistoryScreen;
