import { View, Text, ScrollView, Image, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../redux/favoritesSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Categories from "../components/categories";
import FoodItems from "../components/recipes";

export default function CustomRecipesScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const { recipe } = route.params || {}; 
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const favoriteRecipe = useSelector((state) => state.favorites.favoriterecipes);
  const isFavourite = favoriteRecipe.some(fav => fav.title === recipe.title);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const storedRecipes = await AsyncStorage.getItem("customrecipes");
        if (storedRecipes) {
          setRecipes(JSON.parse(storedRecipes));
        }
      } catch (error) {
        console.error("Error fetching recipes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No Recipe Details Available</Text>
      </View>
    );
  }

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(recipe));
  };

  const handleAddRecipe = () => {
    navigation.navigate("RecipesFormScreen");
  };

  const handleRecipeClick = (recipe) => {
    navigation.navigate("CustomRecipesScreen", { recipe });
  };

  const deleteRecipe = async (index) => {
    try {
      let updatedRecipes = [...recipes];
      updatedRecipes.splice(index, 1);
      await AsyncStorage.setItem("customrecipes", JSON.stringify(updatedRecipes));
      setRecipes(updatedRecipes);
    } catch (error) {
      console.error("Error deleting recipe", error);
    }
  };

  const editRecipe = (recipe, index) => {
    navigation.navigate("RecipesFormScreen", { recipeToEdit: recipe, recipeIndex: index });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} testID="scrollContent">
      <View style={styles.imageContainer} testID="imageContainer">
        {recipe.image && <Image source={{ uri: recipe.image }} style={styles.recipeImage} />}
      </View>
      
      <View style={styles.topButtonsContainer} testID="topButtonsContainer">
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleToggleFavorite} style={styles.favoriteButton}>
          <Text>{isFavourite ? "♥" : "♡"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer} testID="contentContainer">
        <Text style={styles.recipeTitle}>{recipe.title}</Text>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Content</Text>
          <Text style={styles.contentText}>{recipe.description}</Text>
        </View>
      </View>

      <TouchableOpacity onPress={handleAddRecipe} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add New Recipe</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#f59e0b" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {recipes.length === 0 ? (
            <Text style={styles.noRecipesText}>No recipes added yet.</Text>
          ) : (
            recipes.map((recipe, index) => (
              <View key={index} style={styles.recipeCard} testID="recipeCard">
                <TouchableOpacity testID="handleRecipeBtn" onPress={() => handleRecipeClick(recipe)}>
                  <Text style={styles.recipeTitle}>{recipe.title}</Text>
                  <Text style={styles.recipeDescription} testID="recipeDescp">
                    {recipe.description.length > 50 ? `${recipe.description.substring(0, 50)}...` : recipe.description}
                  </Text>
                </TouchableOpacity>
                <View style={styles.actionButtonsContainer} testID="editDeleteButtons">
                  <TouchableOpacity onPress={() => editRecipe(recipe, index)} style={styles.editButton}>
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteRecipe(index)} style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  addButton: {
    backgroundColor: "#4F75FF",
    padding: wp(3),
    alignItems: "center",
    borderRadius: 5,
    marginTop: hp(2),
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  scrollContainer: {
    paddingBottom: hp(2),
  },
  noRecipesText: {
    textAlign: "center",
    fontSize: hp(2),
    color: "#6B7280",
    marginTop: hp(5),
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(1),
  },
  editButton: {
    backgroundColor: "#34D399",
    padding: wp(2),
    borderRadius: 5,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#EF4444",
    padding: wp(2),
    borderRadius: 5,
    alignItems: "center",
  }
});
