import { View, Text, ScrollView, Image, StyleSheet, FlatList, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../redux/favoritesSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Categories from "../components/categories";
import FoodItems from "../components/recipes";

export default function HomeScreen({ route }) {
  const [activeCategory, setActiveCategory] = useState("Chicken");
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const favoriterecipes = useSelector((state) => state.favorites.favoriterecipes);

  const { recipeToEdit, recipeIndex, onrecipeEdited } = route.params || {};
  const [title, setTitle] = useState(recipeToEdit ? recipeToEdit.title : "");
  const [image, setImage] = useState(recipeToEdit ? recipeToEdit.image : "");
  const [description, setDescription] = useState(recipeToEdit ? recipeToEdit.description : "");

  const saverecipe = async () => {
    try {
      const newrecipe = { title, image, description };
      const storedRecipes = await AsyncStorage.getItem("customrecipes");
      let recipes = storedRecipes ? JSON.parse(storedRecipes) : [];

      if (recipeToEdit) {
        recipes[recipeIndex] = newrecipe;
      } else {
        recipes.push(newrecipe);
      }

      await AsyncStorage.setItem("customrecipes", JSON.stringify(recipes));
      if (onrecipeEdited) onrecipeEdited();
      navigation.goBack();
    } catch (error) {
      console.error("Error saving recipe", error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer} testID="scrollContainer">
        <View style={styles.headerContainer} testID="headerContainer">
          <Image source={{ uri: 'https://cdn.pixabay.com/photo/2017/02/23/13/05/avatar-2092113_1280.png' }} style={styles.avatar} />
          <Text style={styles.greetingText}>Hello, User!</Text>
        </View>

        <View style={styles.titleContainer}>
          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <TextInput
            placeholder="Image URL"
            value={image}
            onChangeText={setImage}
            style={styles.input}
          />
          {image ? (
            <Image source={{ uri: image }} style={styles.recipeImage} />
          ) : (
            <Text style={styles.imagePlaceholder}>Upload Image URL</Text>
          )}
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline={true}
            numberOfLines={4}
            style={[styles.input, { height: hp(20), textAlignVertical: "top" }]}
          />
          <TouchableOpacity onPress={saverecipe} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save recipe</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: wp(4),
  },
  input: {
    marginTop: hp(2),
    borderWidth: 1,
    borderColor: "#ddd",
    padding: wp(2),
    marginVertical: hp(1),
  },
  recipeImage: {
    width: 300,
    height: 200,
    margin: wp(2),
  },
  imagePlaceholder: {
    height: hp(20),
    justifyContent: "center",
    alignItems: "center",
    marginVertical: hp(1),
    borderWidth: 1,
    borderColor: "#ddd",
    textAlign: "center",
    padding: wp(2),
  },
  saveButton: {
    backgroundColor: "#4F75FF",
    padding: wp(3),
    alignItems: "center",
    borderRadius: 5,
    marginTop: hp(2),
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  titleContainer: {
    marginHorizontal: wp(4),
    marginBottom: hp(2),
  },
  headerContainer: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(2),
    marginTop: hp(-8.5),
  },
  avatar: {
    height: hp(5),
    width: hp(5.5),
  },
  greetingText: {
    fontSize: hp(1.7),
    color: "#52525B",
    fontWeight: "600",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderRadius: 9999,
    textAlign: "center",
  }
});
