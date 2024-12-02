const Delete = async (id: number) => {
  return fetch(`/api/photo/delete?id=${id}`, {
    method: 'DELETE',
  }).then(async (response) => {
    if (response.status === 200) {
      return true;
    }

    const errorData = await response.json();

    throw new Error(errorData.message);
  });
};

export {Delete};
