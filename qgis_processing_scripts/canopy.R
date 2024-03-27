library(terra)
library(sf)
library(sp)
library(lidR)
library(future)

# Parametry
input_point_cloud <- "C:\\Hackathon\\input\\drzewka_wszystkie.laz"   # należy wprowadzić ścieżkę do pliku z chmurą punktów
outputs_catalogue <- "C:\\Hackathon\\output"                         # należy wprowadzić ścieżkę do katalogu, w którym mają być deponowane pliki wyjściowe
raster_name <- "dupa.tiff"                                           # nazwa wyjściowego pliku rastrowego
tree_tops_name <- "dupa2.gpkg"                                       # nazwa wyjściowego pliku wektorowego ze szczytami koron drzew
tree_crown_name <- "dupa3.gpkg"                                      # nazwa wyjściowego pliku wektorowego z koronami koron drzew

# import LAS/LAZ
LASfile <- input_point_cloud
las <- readLAS(LASfile, select = "xyzr", filter = "-drop_z_below 0")
# układ współrzędnych
crs(las) = "EPSG:2180" 


# rasteryzacja koron (.las, rozmiar piksela, algorytm)
# p2r - Point to Raster
chm_p2r_05 <- rasterize_canopy(las, 1, p2r(subcircle = 0.2))


#wygładzanie (średnia)
kernel <- matrix(1,3,3)
chm_p2r_05_smoothed <- terra::focal(chm_p2r_05, w = kernel, fun = mean, na.rm = TRUE)
#zapis rastra z koronami drzew do formatu TIFF
setwd(output_catalogue)      
writeRaster(chm_p2r_05_smoothed, raster_name, overwrite=TRUE)


#Lokalizacja drzew
#lmf - local maximum filter [m] - algorytm znajduje najwyższy punkt w całym sąsiedztwie
#Sąsiedztwo - obszar wokół każdego punktu wyznaczone jako drzewo
ttops_chm_p2r_05_smoothed <- locate_trees(chm_p2r_05_smoothed, lmf(6))

#segmentacja
algo <- dalponte2016(chm_p2r_05_smoothed, ttops_chm_p2r_05_smoothed)
las_segm <- segment_trees(las, algo)
#ostateczne korony - poligony
crowns <- crown_metrics(las_segm, func = .stdtreemetrics, geom = "convex")

#zapis plików końcowych
st_write(ttops_chm_p2r_05_smoothed, tree_tops_name, driver="GPKG", append=FALSE)
st_write(crowns, tree_crown_name, driver="GPKG", append=FALSE)
